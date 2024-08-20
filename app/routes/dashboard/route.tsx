import React from 'react'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { requireUserId } from '~/session.server';
import { useUser } from '~/utils';

import {
  FiMenu,
  FiLogOut,
  FiUser,
  FiCreditCard,
  FiFlag,
  FiHome,
  FiFile,
  FiEdit,
  FiX,
  FiChevronRight,
} from "react-icons/fi/index.js";
import { Form, NavLink, Outlet, useLoaderData, useMatches } from '@remix-run/react';
import Button from '~/components/button';
import { SidebarTrigger } from './components/sidebarTrigger';
import { getParticipantConfigurationRequirements } from '~/models/configuration.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  if (url.pathname === "/dashboard") return redirect("/dashboard/home")

  const config = await getParticipantConfigurationRequirements()

  const userId = await requireUserId(request)
  return json({ userId, config })
};

const Dashboard = () => {
  const user = useUser()
  const matches = useMatches()
  const { config } = useLoaderData<typeof loader>()
  const menuItems = [
    { name: "Início", to: "home", active: "/dashboard/home", icon: <FiHome className='icon' /> },
    { name: "Dados da inscrição", to: "profile", active: "/dashboard/profile", icon: <FiEdit className='icon' /> },
    { name: "Delegação", to: "delegation/participants", active: "/dashboard/delegation", icon: <FiFlag className='icon' /> },
    { name: "Pagamentos", to: "payments/pending", active: "/dashboard/payments", icon: <FiCreditCard className='icon' /> },
    { name: "Documentos", to: "documents", active: "/dashboard/documents", icon: <FiFile className='icon' /> },
  ]

  console.log(config)

  return (
    <div className='dashboard-wrapper'>
      <div className='dashboard-title-box'>
        <h2 className='dashboard-title'>
          FAMUN {new Date().getFullYear()}
        </h2>

        <div className='dashboard-aux-div'>
          <FiChevronRight className='dashboard-arrow-icon-box' />

          <h3 className='dashboard-subtitle'>
            Dashboard
          </h3>
        </div>
      </div>

      <div className='dashboard-navbar'>
        <div className='dashboard-nav-item'>
          <FiUser className='icon' />

          <span>
            {user.name}
          </span>
        </div>

        <div className='dashboard-disappear-on-width'>
          <Form action='/logout' method='post' reloadDocument>
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

                <div className='dashboard-aside-link-container'>
                  {menuItems.map((item, index) => (
                    <NavLink
                      key={index}
                      tabIndex={0}
                      role="link"
                      aria-label={`${item.to}-link`}
                      to={item.to}
                      onClick={close}
                      prefetch='render'
                      className={`dashboard-item ${matches[2].pathname === item.active ? "" : ""}`}
                    >
                      {item.icon} {item.name}
                    </NavLink>
                  ))}
                </div>

                <Form action='/logout' method='post' onClick={close} reloadDocument>
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

      <div className='dashboard-container'>
        <div className='dashboard-sidebar'>
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              tabIndex={0}
              role="link"
              aria-label={`${item.to}-link`}
              to={item.to}
              prefetch='render'
              className={`dashboard-item ${matches[2].pathname === item.active ? "_active" : ""}`}
            >
              {item.icon} {item.name}
            </NavLink>
          ))}
        </div>

        <div className='dashboard-outlet-wrapper'>
          <Outlet context={{ user, config }} />
        </div>
      </div>
    </div >
  )
}

export default Dashboard
