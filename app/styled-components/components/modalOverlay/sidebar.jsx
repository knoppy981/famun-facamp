import { Overlay, useModalOverlay } from 'react-aria';
import * as S from './elements'

const backgroundVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
};

const aside = {
  variants: {
    closed: { x: '100%', opacity: 0 },
    open: { x: 0, opacity: 1 },
  },
  transition: { opacity: { duration: 0.2 } },
};

const Sidebar = ({ state, children, ...props }) => {
  let ref = React.useRef(null);
  let { modalProps, underlayProps } = useModalOverlay(props, state, ref);

  return (
    <Overlay>
      <S.BlurBackground
        {...underlayProps}
        open={state.isOpen}
        animate={state.isOpen ? "open" : "closed"}
        initial="closed"
        exit="closed"
        variants={backgroundVariants}
      >
        <S.Aside
          {...aside}
          {...modalProps}
          ref={ref}
        >
          {children}
        </S.Aside>
      </S.BlurBackground>
    </Overlay>
  );
}

export default Sidebar