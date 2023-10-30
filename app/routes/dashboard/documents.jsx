import { useState, useEffect, useRef } from 'react'
import { useCatch, useFetcher, useLoaderData, useMatches } from '@remix-run/react';
import { json } from '@remix-run/node';
import { AnimatePresence, motion } from 'framer-motion';

import { getDelegationParticipantsFilesById } from '~/models/file.server';
import { getDelegationId, requireUserId } from '~/session.server';
import { prioritizeUser, safeRedirect } from '~/utils';

import * as S from '~/styled-components/dashboard/documents'
import * as E from '~/styled-components/error'
import { FiCheck, FiTrash, FiUpload, FiX } from 'react-icons/fi';
import { MdCloudUpload } from 'react-icons/md';

export const loader = async ({ request }) => {
  const delegationId = await getDelegationId(request)
  const userId = await requireUserId(request)

  if (!delegationId) throw json({ errors: { delegation: "No delegation found" } }, { status: 404 });

  const delegation = await getDelegationParticipantsFilesById(delegationId)

  const reorganizedUsers = prioritizeUser(delegation.participants, userId)
  delegation.participants = reorganizedUsers

  return json({ delegation });
}

const documents = () => {

  const { delegation } = useLoaderData()

  const [[inputOpen, user], setInputOpen] = useState([false, null])
  const handleInputOpen = (user) => {
    setInputOpen([!inputOpen, user ?? null])
  }

  // code for file submission
  const fetcher = useFetcher()

  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [previewImg, setPreviewImg] = useState(null)
  const [dragging, setDragging] = useState(0);

  const onDragOver = event => {
    event.preventDefault();
    setDragging(prevCounter => prevCounter + 1);
  };
  const onDragLeave = event => {
    event.preventDefault();
    setDragging(prevCounter => prevCounter - 1);
  };
  const handleDrop = event => {
    event.preventDefault()
    setDragging(0);

    const files = event.dataTransfer.files;

    if (files.length) {
      setFile(files[0]);
    }
  }
  const onFileChange = event => {
    if (event.target.files.length) {
      setFile(event.target.files[0]);
    }
  };

  // set preview image on file change
  useEffect(() => {
    setPreviewImg(file ? URL.createObjectURL(file) : null)
  }, [file])

  // disable scrolling when file input is open and set variables to original state when closed
  useEffect(() => {
    if (inputOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
      setFile(null)
    }
  }, [inputOpen])

  return (
    <S.Wrapper>
      <S.Title>
        Documentos
      </S.Title>

      {/* <S.Menu ref={stickyRef} isSticky={isSticky}>
        <S.MenuItem active >
          Comprovante de Vacinação
          <S.UnderLine layoutId="vaccinationMenu" />
        </S.MenuItem>
      </S.Menu>

      <S.Container>
        {delegation.participants.map((item, index) => {
          const fileSent = item.file.length > 0

          return (
            <S.Item
              key={index}
            >
              <S.ItemTitle>
                {item.name}
              </S.ItemTitle>

              <S.ColorItem color={!fileSent ? "blue" : "green"} onClick={() => handleInputOpen(item)}>
                <FiUpload /> {!fileSent ? "Enviar" : "Reenviar"}
              </S.ColorItem>

              {fileSent ?
                item.file.map((item, index) => (
                  <S.TruncatedFilename
                    filename={item.fileName}
                    maxLength={15}
                  />
                ))
                : null}
            </S.Item>
          )
        })}
      </S.Container>

      <AnimatePresence initial={false} mode="sync">
        {inputOpen &&
          <S.Blur
            variants={{
              closed: {
                opacity: 0
              },
              open: {
                opacity: 1
              }
            }}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: .3, ease: "easeInOut" }}
            onClick={() => handleInputOpen()}
          ></S.Blur>}
      </AnimatePresence>

      {inputOpen &&
        <S.FileInputContainer>
          <S.FileInputClose onClick={() => handleInputOpen()}>
            <FiX color="black" size={20} />
          </S.FileInputClose>

          Upload de arquivo

          <p>Comprovante de vacinação de {user.name}</p>

          <S.FileForm
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={handleDrop}
            dragging={dragging}
          >
            <input type="file" accept='image/*' hidden ref={inputRef} onChange={onFileChange} />

            {!file ?
              <>
                <MdCloudUpload color='white' size={50} />

                Arraste um arquivo até aqui ou

                <S.SelectFileButton onClick={() => inputRef.current.click()}>
                  Procurar
                </S.SelectFileButton>
              </> :
              <>
                <S.ImagePreview style={{ backgroundImage: `url(${previewImg})` }} onClick={() => setFile(null)}>
                  <S.DeleteImagePreview>
                    <FiTrash />

                    trocar arquivo
                  </S.DeleteImagePreview>
                </S.ImagePreview>

                {file.name}

                <S.SelectFileButton onClick={() => { }} color="green">
                  Enviar
                </S.SelectFileButton>
              </>
            }
          </S.FileForm>
        </S.FileInputContainer>
      } */}
    </S.Wrapper>
  )
}

export function CatchBoundary() {
  const caught = useCatch();
  const matches = useMatches()

  if (caught.data.errors.delegation === "No delegation found") {
    return (
      <E.ErrorBox>
        <E.Subtitle>
          Documentos
        </E.Subtitle>

        <E.Message>
          Para enviar documentos, antes, voce deve entrar em uma delegação!

          <E.GoBacklink to={`/join/delegation?${new URLSearchParams([["redirectTo", safeRedirect(matches[1].pathname)]])}`}>
            Entrar em uma delegação
          </E.GoBacklink>
        </E.Message>
      </E.ErrorBox>
    );
  }

  throw new Error(`Unsupported thrown response status code: ${caught.status}`);
}

export function ErrorBoundary({ error }) {
  if (error instanceof Error) {
    return (
      <E.ErrorBox>
        <E.Subtitle>
          Unknown error
        </E.Subtitle>

        <E.Message>
          {error.message} <E.GoBacklink to='/'>Voltar para página inicial</E.GoBacklink>
        </E.Message>
      </E.ErrorBox>
    );
  }
  return <E.Message>Oops, algo deu errado!</E.Message>;
}

export default documents