import React from 'react'
import { Form, useNavigation, useOutletContext } from '@remix-run/react';
import { Configuration } from '@prisma/client';

import Button from '~/components/button'
import ModalTrigger from '~/components/modalOverlay/trigger';
import { FiCheck, FiCopy, FiEdit, FiInfo, FiLink, FiTrash2 } from 'react-icons/fi/index.js';
import SubscriptionStatusModal from './components/changeSubscriptionStatusModal';
import { ActionFunctionArgs, json } from '@remix-run/node';
import { createNewJoinAuthentication, deleteJoinAuthenticationItem } from './utils/handleGeneratedLinksCodes';
import { useCopyToClipboard } from '../dashboard.delegation/hooks/useCopyToClipboard';
import PopoverTrigger from '~/components/popover/trigger';
import LinkInfoModal from './components/linkInfoModal';
import CreateLinkModal from './components/createLinkModal';
import Spinner from '~/components/spinner';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const action = formData.get("action")
  const linkName = formData.get("link-name")

  try {
    if (action === "delete") {
      const linkCode = formData.get("link-code")
      if (linkCode && typeof linkCode === "string") {
        await deleteJoinAuthenticationItem(linkCode)
      }
      return json({ deletedAuthenticationCode: linkCode })
    } else if (action === "create" && typeof linkName === "string") {
      const newAuthentication = await createNewJoinAuthentication(linkName as string)
      return json({ newAuthentication })
    }
  } catch (error) {
    console.log(error)
  }

  return json({})
}

const Configurations = () => {
  const { configurations } = useOutletContext<{ configurations: Configuration }>()

  return (
    <div className='admin-container padding'>
      <div className='home-container'>
        <ModalTrigger
          label={<div className='home-item'>
            <div className='home-item-title'>
              Inscrições para Ensino Médio
            </div>

            <div className={`secondary-button-box ${configurations.subscriptionEM ? 'green-light' : 'red-light'}`}>
              <div className='button-child'>
                <FiEdit className='icon' /> {configurations.subscriptionEM ? "Abertas" : "Fechadas"}
              </div>
            </div>
          </div>}
        >
          {(close: () => void) => <SubscriptionStatusModal close={close} status={configurations.subscriptionEM} type="em" />}
        </ModalTrigger>

        <ModalTrigger
          label={<div className='home-item'>
            <div className='home-item-title'>
              Inscrições para Universidades
            </div>

            <div className={`secondary-button-box ${configurations.subscriptionUNI ? 'green-light' : 'red-light'}`}>
              <div className='button-child'>
                <FiEdit className='icon' /> {configurations.subscriptionUNI ? "Abertas" : "Fechadas"}
              </div>
            </div>
          </div>}
        >
          {(close: () => void) => <SubscriptionStatusModal close={close} status={configurations.subscriptionUNI} type="uni" />}
        </ModalTrigger>
      </div>

      <h2 className='section-title'>
        Links para autorizar a Inscrição
      </h2>

      <ModalTrigger
        isDismissable
        buttonClassName="secondary-button-box blue-light"
        label={<><FiLink className='icon' /> Gerar novo link</>}
      >
        {(close: () => void) => <CreateLinkModal close={close} />}
      </ModalTrigger>

      <div className='admin-configuration-link-list'>
        {configurations.generatedJoinAuthentication.map((item, index) => <LinkItem item={item} key={index} index={index} />)}
      </div>

      <i className='payments-warning'>
        Observações:
        <br />
        Os link expiram após 5 dias
        <br />
        Se um participante já criou a conta com o link, porém ainda não entrou ou criou uma delegação, ele terá que usar o link novamente (estando logado no sistema) para ingressar/criar uma delegação
        <br />
        Se o Link for deletado, ele não poderá ser mais usado por ninguem
      </i>
    </div>
  )
}

const LinkItem = ({ item, index }: { item: { name: string; code: string; link: string; expiresAt: Date; createdAt: Date; } & {}, index: number }) => {
  const [isCopied, handleCopyClick] = useCopyToClipboard(item.link)
  const expired = new Date(item.expiresAt) < new Date()
  const navigation = useNavigation()

  return (
    <div className={`admin-configuration-link-item ${expired ? "expired" : ""}`}>
      <p className='text'>
        {index + 1}.
      </p>
      <Button onPress={handleCopyClick}>
        {isCopied ? <FiCheck className='icon' /> : <FiCopy className='icon' />}
      </Button>

      <p className='text overflow'>
        {item.link}
      </p>

      <PopoverTrigger label={<FiInfo className='icon' />}>
        <LinkInfoModal info={item} expired={expired} />
      </PopoverTrigger>

      <Form method="post">
        <Button type='submit' name='action' value="delete" isDisabled={navigation.state !== "idle"}>
          {navigation.state !== "idle" && navigation.formAction === "/admin/configurations/main" && navigation.formData?.get("link-code") === item.code ?
            <Spinner dim="18px" />
            :
            <FiTrash2 className='icon' />
          }
        </Button>

        <input type='hidden' name="link-code" value={item.code} />
      </Form>
    </div>
  )
}


export default Configurations
