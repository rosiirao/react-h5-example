export const getState = () => {
  if (document.visibilityState === 'hidden') {
    return 'hidden';
  }
  if (document.hasFocus()) {
    return 'active';
  }
  return 'passive';
};

// freeze and resume event in chrome
export const listenFreeze = () => {
  document.addEventListener('freeze', () => {
    // The page is now frozen.
  });

  document.addEventListener('resume', () => {
    // The page has been unfrozen.
  });
};

//  document.wasDiscarded works in chrome
// To determine whether a page is discarded while in a hidden tab, the following code can be used
// Page was previously discarded by the browser while in a hidden tab.
// The wasDiscarded property can be observed at the page load time.
export const wasDiscarded = () => {
  return !!document['wasDiscarded'];
};
