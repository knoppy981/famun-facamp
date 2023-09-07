import { useLink } from 'react-aria';
import styled from 'styled-components';

const StyledLink = styled.a`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  font-size: inherit;
  text-decoration: ${props => props.underline ? 'underline' : 'none'};
`

const Link = (props) => {
  let ref = React.useRef(null);
  let { linkProps } = useLink(props, ref);

  return (
    <StyledLink
      {...linkProps}
      ref={ref}
      href={props.href}
      target={props.target}
    >
      {props.children}
    </StyledLink>
  );
}

export default Link