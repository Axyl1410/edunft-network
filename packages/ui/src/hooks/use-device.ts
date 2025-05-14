import {
  breakpoints,
  useMediaQuery,
} from "@workspace/ui/hooks/use-media-query";

export function useDevice() {
  const isMobile = useMediaQuery(breakpoints.mobile);
  const isTablet = useMediaQuery(breakpoints.tablet);
  const isDesktop = useMediaQuery(breakpoints.desktop);
  const isLargeDesktop = useMediaQuery(breakpoints.largeDesktop);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    // Broader categories
    isTouch: isMobile || isTablet,
    isDesktopOrLarger: isDesktop || isLargeDesktop,
  };
}
