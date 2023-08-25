import { useLink } from 'react-aria';
import { Link as _Link } from '@remix-run/react';
import styled from 'styled-components';

const StyledLink = styled(_Link)`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  font-size: inherit;
  text-decoration: ${props => props.underline ? 'underline' : 'none'};

  svg {
    font-size: 2rem;
    transform: translateY(1px);
  }
`

const Link = (props) => {
  let ref = React.useRef(null);
  let { linkProps } = useLink(props, ref);

  return (
    <StyledLink
      {...linkProps}
      {...props}
      ref={ref}
      href={props.href}
      target={props.target}
      rel="noopener noreferrer"
    >
      {props.children}
    </StyledLink>
  );
}

export default Link