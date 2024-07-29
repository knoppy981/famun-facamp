import React from 'react'
import { useFetcher, useOutletContext } from '@remix-run/react';

import { useConfigurationsUpdate } from '../admin.configurations/hooks/useConfigurationsUpdate';
import { useButtonState } from '../admin.configurations/hooks/useButtonState';

import Button from '~/components/button'
import { AnimatePresence, motion } from 'framer-motion';
import { useOnScreen } from '~/hooks/useOnScreen';
import EditCommitteesConfigurations from './components/adminEditCommitteesConfigurations';
import { Configuration } from '@prisma/client';

const ComitteesConfigurations = () => {
  const { configurations } = useOutletContext<{ configurations: Configuration }>()
  const [buttonRef, isRefVisible] = useOnScreen();
  const fetcher = useFetcher()
  const { readySubmission, userWantsToChangeData, handleSubmission, handleChange } =
    useConfigurationsUpdate(configurations, fetcher)
  const [buttonLabel, buttonIcon, buttonColor] = useButtonState(userWantsToChangeData, readySubmission, fetcher.state)

  return (
    <div className='admin-container padding'>
      <h2 className='' ref={buttonRef}>
        <Button
          onPress={handleSubmission}
          className={`secondary-button-box ${buttonColor ? buttonColor + "-light" : ""}`}
        >
          {buttonIcon} {buttonLabel}
        </Button>
      </h2>

      <EditCommitteesConfigurations
        isDisabled={!userWantsToChangeData}
        actionData={fetcher.data}
        defaultValues={configurations}
        id=""
        handleChange={handleChange}
      />

      <AnimatePresence>
        {!isRefVisible &&
          <motion.div
            className='sticky-button'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className={`secondary-button-box ${buttonColor ? `${buttonColor}-light` : ""}`}
              onPress={handleSubmission}
            >
              {buttonIcon} {buttonLabel}
            </Button>
          </motion.div>}
      </AnimatePresence>
    </div>
  )
}

export default ComitteesConfigurations
