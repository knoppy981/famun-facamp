import { useState } from 'react'
import { Link } from '@remix-run/react';

import * as N from './elements'
import { BsGlobe2 } from "react-icons/bs";

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <N.Nav>
      <N.NavContainer>
        <N.NavLogo href="https://famun.com.br/">
          <N.NavLogoImage src="https://famun.com.br/wp-content/uploads/2022/05/famun-logo-maior.png" />
        </N.NavLogo>

        {/* <N.NavMenu>
          <N.NavItem
            to={{
              pathname: "/auth/login",
            }}
          >
            Entrar
          </N.NavItem>

          <N.NavItem
            to={{
              pathname: "/auth/join",
            }}
          >
            Cadastrar
          </N.NavItem>
        </N.NavMenu> */}

        <N.UserNavMenu>
          <N.NavItem
            to="/dashboard/help"
          >
            Ajuda
          </N.NavItem>
          <div
            style={{ height: "100%" }}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <N.NavItem
              to={'/'}
            >
              <N.UserButton>
                <BsGlobe2 />
                PT - BR
              </N.UserButton>
            </N.NavItem>

            {menuOpen &&
              <N.DropDownContainer>
                <N.DropDownItem>
                  Mudar Idioma
                </N.DropDownItem>
                <N.DropDownItem>
                  Configuração
                </N.DropDownItem>
                <Link
                  to="/logout"
                >
                  <N.DropDownItem>
                    Logout
                  </N.DropDownItem>
                </Link>
              </N.DropDownContainer>
            }
          </div>
        </N.UserNavMenu>
      </N.NavContainer>
    </N.Nav>
  )
}

export default Navbar