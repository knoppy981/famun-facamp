import { useTooltipTriggerState } from 'react-stately';
import { TooltipTriggerProps, mergeProps, useTooltip, useTooltipTrigger } from 'react-aria';
import React from 'react';

export function Tooltip({ state, ...props }: any) {
  let { tooltipProps } = useTooltip(props, state);

  return (
    <span {...mergeProps(props, tooltipProps)} className='tooltip'>
      {props.children}
    </span>
  );
}

export function TooltipTrigger(props: any) {
  let state = useTooltipTriggerState(props);
  let ref = React.useRef(null);

  let { triggerProps, tooltipProps } = useTooltipTrigger(props, state, ref);

  return (
    <span className='tooltip-trigger'>
      <button
        type='button'
        ref={ref}
        {...triggerProps}
        style={{ border: "none", outline: "none" }}
        onClick={() => state.open()}
      >
        {props.children}
      </button>
      {state.isOpen && (
        <Tooltip state={state} {...tooltipProps}>{props.tooltip}</Tooltip>
      )}
    </span>
  );
}