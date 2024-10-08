import React, { Key } from 'react'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { requireAdminId } from '~/session.server';
import { FiArrowLeft, FiChevronRight, FiLogOut, FiMenu, FiSettings, FiX } from "react-icons/fi/index.js";
import { Form, NavLink, Outlet, useMatches, useNavigate, useSearchParams, useSubmit } from '@remix-run/react';
import Button from '~/components/button';
import { SidebarTrigger } from '../dashboard/components/sidebarTrigger';
import { Select, Item } from './components/select';
import useDidMountEffect from '~/hooks/useDidMountEffect';
import { BsUpcScan } from 'react-icons/bs/index.js';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdminId(request)
  const url = new URL(request.url);
  if (url.pathname === "/admin") return redirect("/admin/delegations")

  return json({})
};

const AdminPage = () => {
  const matches = useMatches()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [participationMethod, setParticipationMethod] = React.useState<Key>(searchParams.get("pm") ?? "Escola")

  return (
    <div className='admin-wrapper'>
      <div className='admin-title-box'>
        <h2 className='dashboard-title'>
          FAMUN {new Date().getFullYear()}
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
          {matches?.[2]?.id !== "routes/admin._dashboard" ?
            <NavLink
              to="/admin/delegations"
              className="link text"
            >
              <FiArrowLeft className='icon' /> Voltar
            </NavLink>
            :
            <Select
              className="admin-title-select"
              name="pm"
              aria-label="Posição do(a) Professor(a) Orientador(a)"
              hideLabel={true}
              selectedKey={participationMethod}
              onSelectionChange={(key: React.Key) => {
                setParticipationMethod(key)
                navigate(`${matches[3].pathname}?pm=${key}`, { replace: true })
              }}
              items={[
                { id: "Escola", textValue: "Ensino Medio" },
                { id: "Universidade", textValue: "Universidade" },
              ]}
            >
              {(item) => <Item textValue={item.id}>{item.textValue}</Item>}
            </Select>
          }
        </div>

        <div className='dashboard-disappear-on-width'>
          <NavLink
            to="configurations/main"
            className="link text"
            preventScrollReset
          >
            <FiSettings className='icon' />
          </NavLink>
        </div>

        <div className='dashboard-disappear-on-width'>
          <NavLink
            to="presence_control"
            className="link text"
            preventScrollReset
          >
            <BsUpcScan className='icon' />
          </NavLink>
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
                  <NavLink
                    tabIndex={0}
                    role="link"
                    aria-label="settings-link"
                    to="configurations/main"
                    onClick={close}
                    prefetch='render'
                    preventScrollReset
                    className={`dashboard-item`}
                  >
                    <FiSettings className='icon' /> Configurações
                  </NavLink>

                  <NavLink
                    tabIndex={0}
                    role="link"
                    aria-label="settings-link"
                    to="presence_control"
                    onClick={close}
                    prefetch='render'
                    preventScrollReset
                    className={`dashboard-item`}
                  >
                    <BsUpcScan className='icon' /> Controled de Presença
                  </NavLink>
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

      <Outlet context={{ participationMethod }} />
    </div>
  )
}

export default AdminPage
