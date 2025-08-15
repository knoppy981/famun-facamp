import React from 'react'
import { NavLink, Outlet, useLoaderData } from '@remix-run/react';
import qs from "qs"
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';

import { getConfigurations, updateConfiguration } from '~/models/configuration.server';
import { requireAdminId } from '~/session.server';
import { iterateObject } from '../dashboard/utils/findDiffrences';
import { getCorrectErrorMessage } from '~/utils/error';
import { updateConfigurationSchema } from '~/schemas';
import { useStickyContainer } from '~/hooks/useStickyContainer';

import { motion } from 'framer-motion';

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)
  const formData = await request.formData();
  let changes = JSON.parse(formData.get("changes") as string)
  let data: any = {}

  console.log(changes)

  iterateObject(changes, (key, value, path) => {
    if (value === "false" || value === "true") value = value === "true"
    if (key.startsWith("preco")) value = parseInt(value)

    if (key.startsWith("conselhos") || key === "representacoesExtras") {
      data[key] = { set: value === "" ? [] : value }
    } else {
      data[key] = value
    }
  });

  try {
    await updateConfigurationSchema.validateAsync(data)
  } catch (error) {
    console.log(error)
    const [label, msg, group, path] = getCorrectErrorMessage(error)
    return json(
      { errors: { [label]: msg, errorGroup: group, path: path } },
      { status: 400 }
    );
  }

  return updateConfiguration(data)
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  const configurations = await getConfigurations()

  if (configurations === null) throw json({})

  return json({ configurations })
}

const AdminConfigurations = () => {
  const [stickyRef, isSticky] = useStickyContainer()
  const { configurations } = useLoaderData<typeof loader>()

  const menuItems = [
    { name: "Configurações Gerais", to: "main", active: "/admin/configurations/main" },
    { name: "Configurações de Comitês e Conferências", to: "committees", active: "/admin/configurations/committees" },
    { name: "Configurações de Pagamentos", to: "payments", active: "/admin/configurations/payments" },
  ]

  return (
    <div style={{ display: "contents" }}>
      <div className={`section-menu ${isSticky ? "sticky" : ""}`} ref={stickyRef}>
        {menuItems.map((item, index) => {
          const ref = React.useRef<HTMLAnchorElement>(null)

          return (
            <NavLink
              key={index}
              className="section-menu-item"
              tabIndex={0}
              role="link"
              prefetch='render'
              aria-label={`${item.to}-link`}
              preventScrollReset
              onClick={() => ref.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
              })}
              to={{
                pathname: item.to,
              }}
              ref={ref}
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  {isActive ? <motion.div className='section-underline' layoutId="configurationPageUnderline" /> : null}
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      <Outlet context={{ configurations }} />
    </div>
  )
}

export default AdminConfigurations
