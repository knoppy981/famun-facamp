import type { Ref } from 'react';
import { mergeRefs } from '~/lib/merge-refs';
import React, { forwardRef, useRef } from 'react';
import { AriaButtonProps, mergeProps, useButton, useFocusRing, useHover } from 'react-aria';

type ButtonProps = AriaButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
{ loading?: boolean }

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => {
  const { className, children, loading, name, value, ...rest } =
    props
  const ref = useRef<HTMLButtonElement>(null)
  const { focusProps, isFocusVisible } = useFocusRing()
  const { hoverProps, isHovered } = useHover({ ...props })
  const { buttonProps, isPressed } = useButton({ ...rest, }, ref)

  return (
    <div
      className={className}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focus-visible={isFocusVisible || undefined}
    >
      <button
        ref={mergeRefs([ref, forwardedRef])}
        className="default-button"
        {...mergeProps(buttonProps, focusProps, hoverProps)}
        name={name} 
        value={value}
      >
        {children}
      </button>
    </div>

  );
})

export default Button