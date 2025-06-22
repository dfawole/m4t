/**
 * Scrolls to the top of the page smoothly
 */
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/**
 * A higher-order component that wraps a link to add scroll-to-top functionality
 * @param onClick Original onClick handler
 * @returns A new onClick handler that scrolls to top
 */
export function withScrollToTop(onClick?: () => void) {
  return (e: React.MouseEvent) => {
    if (onClick) onClick();
    scrollToTop();
  };
}