import React from 'react';
import { useDialog } from 'react-aria';
import { motion } from 'framer-motion';

const Dialog = ({ title, children, maxWidth, style, ...props }: { title?: string; children: React.ReactNode, maxWidth?: boolean, style?: any }) => {
  const ref = React.useRef(null);
  const { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <motion.div
      key={"dialog-container"}
      {...dialogProps as any}
      ref={ref}
      style={style}
      className={`dialog ${maxWidth ? "max-width" : ""}`}
    >
      {title &&
        (
          <h3 {...titleProps} style={{ marginTop: 0 }}>
            {title}
          </h3>
        )}

      {children}
    </motion.div>
  );
}

export default Dialog