import React from 'react';
import { useDialog } from 'react-aria';

const Dialog = ({ title, children, maxWidth, ...props }: { title?: string; children: React.ReactNode, maxWidth?: boolean }) => {
  const ref = React.useRef(null);
  const { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <div
      {...dialogProps as any}
      ref={ref}
      className={`dialog ${maxWidth ? "max-width" : ""}`}
    >
      {title &&
        (
          <h3 {...titleProps} style={{ marginTop: 0 }}>
            {title}
          </h3>
        )}
        
      {children}
    </div>
  );
}

export default Dialog