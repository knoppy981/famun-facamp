import { useState, useRef, useEffect } from 'react';
import { json, redirect } from '@remix-run/node';
import { useMatches, useCatch, useLoaderData, Outlet, NavLink } from '@remix-run/react';

import { getDelegationId } from '~/session.server';
import { safeRedirect} from '~/utils';
import { getDelegationById } from '~/models/delegation.server';

import * as S from '~/styled-components/dashboard/delegation'
import * as E from '~/styled-components/error'
import { FiMail } from 'react-icons/fi';
import PopoverTrigger from '~/styled-components/components/popover/popoverTrigger';
import Dialog from '~/styled-components/components/dialog';
import Button from '~/styled-components/components/button';
import { useIsContainerSticky } from '~/hooks/useIsContainerSticky';

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.pathname === "/dashboard/delegation") return redirect("/dashboard/delegation/participants")

  const delegationId = await getDelegationId(request)

  if (!delegationId) throw json({ errors: { delegation: "No delegation found" } }, { status: 404 });

  const delegation = await getDelegationById(delegationId)

  return json({ delegation });
}

const Delegation = () => {

  const { delegation } = useLoaderData()
  const [stickyRef, isSticky] = useIsContainerSticky()
  const [isCopied, handleCopyClick] = useCopyToClipboard(delegation.inviteLink)

  return (
    <S.Wrapper>
      <S.Nav>
        <S.TilteContainer>
          <S.SubTitle>
            Delegação
          </S.SubTitle>

          <S.Title>
            {delegation.school}
          </S.Title>
        </S.TilteContainer>

        <S.PopoverContainer>
          <PopoverTrigger label={<><FiMail /> Convidar</>} isNonModal>
            <Dialog>
              <S.DialogTitle>
                Compartilhe o link abaixo
              </S.DialogTitle>

              <S.DialogLinkContainer>
                <S.ReadOnlyInput readOnly value={delegation.inviteLink} />

                <S.VerticalLine />

                <S.CopyButtonBox isCopied={isCopied}>
                  <Button onPress={handleCopyClick}>
                    {isCopied ? 'Copiado!' : 'Copiar'}
                  </Button>
                </S.CopyButtonBox>
              </S.DialogLinkContainer>

              <S.DialogTitle>
                Ou utilize este código na inscrição:
              </S.DialogTitle>

              <S.DialogItem>
                {delegation.code}
              </S.DialogItem>
            </Dialog>
          </PopoverTrigger>
        </S.PopoverContainer>
      </S.Nav>

      <S.Menu ref={stickyRef} isSticky={isSticky}>
        {[
          { to: "participants", title: "Participantes" },
          { to: "createUser", title: "Criar Participante" },
          { to: "data", title: "Dados" }
        ].map((item, i) => (
          <S.MenuItem key={i}>
            <NavLink
              tabIndex="0"
              role="link"
              prefetch='render'
              aria-label={`${item.title}-page`}
              to={item.to}
            >
              {({ isActive }) => (
                <> {item.title} {isActive ? <S.UnderLine layoutId="delegationPageUnderline" /> : null} </>
              )}
            </NavLink>
          </S.MenuItem>
        ))}
      </S.Menu>

      <Outlet context={delegation} />
    </S.Wrapper>
  )
}

function useCopyToClipboard(value) {
  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(value)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2500);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  return [isCopied, handleCopyClick]
}

export function CatchBoundary() {
  const caught = useCatch();
  const matches = useMatches()

  if (caught.data.errors.delegation === "No delegation found") {
    return (
      <S.Wrapper>
        <S.Title>
          Delegação
        </S.Title>

        <E.Message style={{ marginTop: '25px' }}>
          Parece que você ainda nao entrou para uma delegação

          <E.GoBacklink to={`/join/delegation?${new URLSearchParams([["redirectTo", safeRedirect(matches[1].pathname)]])}`}>
            Entrar em uma delegação
          </E.GoBacklink>
        </E.Message>

      </S.Wrapper>
    );
  }

  throw new Error(`Unsupported thrown response status code: ${caught.status}`);
}

export function ErrorBoundary({ error }) {
  if (error instanceof Error) {
    return (
      <S.Wrapper>
        <S.Title>
          Unknown error
        </S.Title>

        <E.Message>
          {error.message} <E.GoBacklink to='/'>Voltar para página inicial</E.GoBacklink>
        </E.Message>
      </S.Wrapper>
    );
  }
  return <E.Message>Oops, algo deu errado!</E.Message>;
}

export default Delegation