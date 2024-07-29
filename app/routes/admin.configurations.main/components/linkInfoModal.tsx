import React from "react"
import Dialog from '~/components/dialog'

const LinkInfoModal = ({ info, expired }: { info: { name: string; code: string; link: string; expiresAt: Date; createdAt: Date; } & {}, expired: boolean }) => {
  return (
    <Dialog maxWidth>
      {expired ?
        <div className='text'>
          O link expirou!
        </div>
        :
        <>
          <div className='text'>
            Nome do Link: {info.name}
          </div>

          <div className='text'>
            O link expira em: {new Date(info.expiresAt).toLocaleDateString("pt-BR")}
          </div>

          <div className='text'>
            O link foi criado em: {new Date(info.createdAt).toLocaleDateString("pt-BR")}
          </div>
        </>
      }
    </Dialog>
  )
}

export default LinkInfoModal
