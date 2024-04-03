import React from 'react'
import { useFetcher, useLoaderData } from '@remix-run/react';
import qs from "qs"
import { ParticipationMethod } from '@prisma/client';
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';

import { getConfigurations, updateConfiguration } from '~/models/configuration.server';
import { useConfiuratiionsUpdate } from './useConfigurationsUpdate';
import { useButtonState } from './useButtonState';
import { requireAdminId } from '~/session.server';
import { iterateObject } from '../dashboard/utils/findDiffrences';
import { getCorrectErrorMessage } from '~/utils/error';
import { updateConfigurationSchema } from '~/schemas';

import Button from '~/components/button'
import EditConfigurations from './edit-configurations-components';

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdminId(request)
  const formData = await request.formData();
  let changes = qs.parse(formData.get("changes") as string)
  let data: any = {}

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
  const participationMethod = url.searchParams.get("pm") as ParticipationMethod

  const configurations = await getConfigurations()

  if (configurations === null) throw json({})

  return json({ configurations })
}

const Configurations = () => {
  const { configurations } = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const { readySubmission, userWantsToChangeData, handleSubmission, handleChange } =
    useConfiuratiionsUpdate(configurations, fetcher)
  const [buttonLabel, buttonIcon, buttonColor] = useButtonState(userWantsToChangeData, readySubmission, fetcher.state)

  return (
    <div className='admin-container'>
      <h2 className='admin-section-title'>
        Configurações

        <Button
          onPress={handleSubmission}
          className={`secondary-button-box ${buttonColor ? buttonColor + "-light" : ""}`}
        >
          {buttonIcon} {buttonLabel}
        </Button>
      </h2>

      <EditConfigurations
        isDisabled={!userWantsToChangeData}
        actionData={fetcher.data}
        defaultValues={configurations}
        id=""
        handleChange={handleChange}
      />
    </div>
  )
}

export default Configurations
