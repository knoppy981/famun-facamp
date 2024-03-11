import React, { ReactNode, forwardRef } from 'react';
import { LinkProps, Link as DefaultLink } from "@remix-run/react";
import { AriaLinkOptions, useLink } from 'react-aria';

import { mergeRefs } from '~/lib/merge-refs';

type DefaultLinkProps = LinkProps & {
  children: ReactNode;
  underline?: number
}

const Link = forwardRef<HTMLAnchorElement, DefaultLinkProps>((props, forwardedRef) => {
  const ref = React.useRef<HTMLAnchorElement>(null);

  return (
    <DefaultLink
      className={`link ${props.underline === 1 ? 'underline' : ''}`}
      ref={mergeRefs([ref, forwardedRef])}
      {...props}
    >
      {props.children}
    </DefaultLink>
  );
})

type HTMLLinkProps = AriaLinkOptions & {
  children: ReactNode
}

export const HTMLLink = forwardRef<HTMLAnchorElement, HTMLLinkProps>((props, forwardedRef) => {
  let ref = React.useRef(null);
  let { linkProps } = useLink(props, ref);

  return (
    <a
      {...linkProps}
      ref={mergeRefs([ref, forwardedRef])}
      href={props.href}
      target={props.target}
      style={{
        color: "inherit",
        textDecoration: "inherit"
      }}
    >
      {props.children}
    </a>
  );
})

export default Link