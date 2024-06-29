import { NavLink, Outlet, useMatches, useOutletContext } from '@remix-run/react'
import React from 'react'
import { useStickyContainer } from '~/hooks/useStickyContainer'
import { motion } from 'framer-motion';
import { ParticipationMethod } from '@prisma/client';

const AdminDashboard = () => {
  const [stickyRef, isSticky] = useStickyContainer()
  const { participationMethod } = useOutletContext<{ participationMethod: ParticipationMethod }>()

  const menuItems = [
    { name: "Delegações", to: "delegations", active: "/admin/delegations" },
    { name: "Designação", to: "committees", active: "/admin/committees" },
    { name: "Participantes", to: "participants", active: "/admin/participants" },
    { name: "Credenciamento", to: "credentials", active: "/admin/credentials" },
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
                search: `pm=${participationMethod}`,
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

export default AdminDashboard
