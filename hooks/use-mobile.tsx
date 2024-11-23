import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to determine if the current window width is considered mobile.
 *
 * This hook listens for changes in the window's width and updates the state accordingly.
 * It uses the `window.matchMedia` API to detect if the window width is less than the defined
 * `MOBILE_BREAKPOINT`.
 *
 * @returns {boolean} - Returns `true` if the window width is less than the `MOBILE_BREAKPOINT`, otherwise `false`.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
