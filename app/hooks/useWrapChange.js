import { useRef, useEffect, useState } from "react";

export function useWrapChange() {
  const ref = useRef(null);
  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (!ref.current) return;
      const children = ref.current.children;
      if (children.length < 2) return;
      setIsWrapped(children[0].offsetTop !== children[1].offsetTop);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // check on mount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return [ref, isWrapped];
};