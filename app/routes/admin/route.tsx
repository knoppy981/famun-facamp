import React, { Key, useRef } from 'react'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { requireAdminId } from '~/session.server';
import { FiChevronRight, FiLogOut, FiMenu, FiX } from "react-icons/fi/index.js";
import { Form, NavLink, Outlet, useMatches, useNavigate, useSearchParams } from '@remix-run/react';
import Button from '~/components/button';
import { SidebarTrigger } from '../dashboard/sidebar';
import { Select, Item } from './select';
import { motion } from 'framer-motion';
import { useStickyContainer } from '~/hooks/useStickyContainer';
import Link from '~/components/link';
import useDidMountEffect from '~/hooks/useDidMountEffect';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)
  const url = new URL(request.url);
  if (url.pathname === "/admin") return redirect("/admin/delegations")

  return json({})
};

const AdminPage = () => {
  const matches = useMatches()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [stickyRef, isSticky] = useStickyContainer()
  const [participationMethod, setParticipationMethod] = React.useState<Key>(searchParams.get("pm") ?? "Escola")

  const menuItems = [
    { name: "Delegações", to: "delegations", active: "/admin/delegations" },
    { name: "Designação", to: "comittees", active: "/admin/comittees" },
    { name: "Participantes", to: "participants", active: "/admin/participants" },
    { name: "Credenciamento", to: "credentials", active: "/admin/credentials" },
  ]

  useDidMountEffect(() => {
    navigate(`${matches?.[2].pathname}?pm=${participationMethod}`, { replace: true })
  }, [participationMethod])

  return (
    <div className='admin-wrapper'>
      <div className='admin-title-box'>
        <h2 className='dashboard-title'>
          FAMUN 2024
        </h2>

        <div className='dashboard-aux-div'>
          <FiChevronRight className='dashboard-arrow-icon-box' />

          <h3 className='dashboard-subtitle'>
            Admin
          </h3>
        </div>
      </div>

      <div className='dashboard-navbar'>
        <div className='dashboard-nav-item'>
          <Select
            className="admin-title-select"
            name="pm"
            aria-label="Posição do(a) Professor(a) Orientador(a)"
            hideLabel={true}
            selectedKey={participationMethod}
            onSelectionChange={(key: React.Key) => {
              setParticipationMethod(key)
            }}
            items={[
              { id: "Escola", textValue: "Ensino Medio" },
              { id: "Universidade", textValue: "Universidade" },
            ]}
          >
            {(item) => <Item textValue={item.id}>{item.textValue}</Item>}
          </Select>
        </div>

        <div className='dashboard-disappear-on-width'>
          <Form action='/logout' method='post'>
            <Button type='submit'>
              <div className='dashboard-nav-item'>
                <FiLogOut className='icon' />

                Sair
              </div>
            </Button>
          </Form>
        </div>

        <div className='dashboard-disappear-on-width reverse'>
          <SidebarTrigger label={<FiMenu style={{ fontSize: "2.4rem" }} />} isDismissable>
            {(close: any) =>
              <div className='dashboard-aside-container'>
                <div className='dashboard-aside-navbar'>
                  Menu

                  <Button onPress={close}>
                    <FiX className='icon' />
                  </Button>
                </div>

                <Form action='/logout' method='post' onClick={close}>
                  <Button type='submit'>
                    <FiLogOut className='icon' />

                    Sair
                  </Button>
                </Form>
              </div>
            }
          </SidebarTrigger>
        </div>
      </div>

      <div className={`section-menu ${isSticky ? "sticky" : ""}`} ref={stickyRef}>
        {menuItems.map((item, index) => {
          const ref = useRef<HTMLAnchorElement>(null)

          React.useEffect(() => {
            if (matches?.[2]?.pathname === item.active) ref.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            })
          }, [matches])

          return (
            <NavLink
              key={index}
              className="section-menu-item"
              tabIndex={0}
              role="link"
              prefetch='render'
              aria-label={`${item.to}-link`}
              to={{
                pathname: item.to,
                search: searchParams.toString(),
              }}
              ref={ref}
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  {isActive ? <motion.div className='section-underline' layoutId="delegationPageUnderline" /> : null}
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      <Outlet context={{ participationMethod }} />
    </div>
  )
}

export default AdminPage
