import { MutableRefObject, useEffect, useRef, useState } from "react";

export function useStickyContainer(): [
  MutableRefObject<any>, boolean
] {
  const stickyRef = useRef<any>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { top } = stickyRef?.current?.getBoundingClientRect();
      setIsSticky(top <= 45);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return [stickyRef, isSticky]
}