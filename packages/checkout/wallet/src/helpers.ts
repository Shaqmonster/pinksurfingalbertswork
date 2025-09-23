// Copyright (C) LoginID

/**
 * Checks if the current window is inside an iframe.
 * @returns {boolean} True if in an iframe, otherwise false.
 */
const isInIframe = (): boolean => {
    return window.self !== window.top;
  };
  
  export { isInIframe };
  