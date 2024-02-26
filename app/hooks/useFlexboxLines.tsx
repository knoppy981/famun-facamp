import React from "react";

export default function useFlexboxLines(): [React.MutableRefObject<any>, number] {
  const [lines, setLines] = React.useState(0);
  const ref = React.useRef<any>(null)

  React.useEffect(() => {
    if (!ref.current) return;

    const calculateLines = (): void => {
      const container = ref.current;
      if (!container) return;
    
      const children = container.children;
      const offsetTopCounts: { [key: number]: number } = {};
    
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement; 
        const offsetTop = child.offsetTop;
    
        if (offsetTopCounts.hasOwnProperty(offsetTop)) {
          offsetTopCounts[offsetTop]++;
        } else {
          offsetTopCounts[offsetTop] = 1;
        }
      }
    
      const maxCount = Math.max(...Object.values(offsetTopCounts));
      setLines(maxCount); 
    };

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        calculateLines();
      }
    });

    resizeObserver.observe(ref.current);

    // Initial calculation
    calculateLines();

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]); // Rerun when the ref changes

  return [ref, lines];
};