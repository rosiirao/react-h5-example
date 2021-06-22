// Set the name of the hidden property and the change event for visibility
const getHiddenProperty = (() => {
  // Set the name of the hidden property and the change event for visibility
  let hidden: 'hidden' | undefined,
    visibilityChange: 'visibilitychange' | undefined;
  if (document.hidden !== undefined) {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  } /* else if (document.msHidden !== undefined) {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  } */

  return [hidden, visibilityChange] as [
    'hidden' | undefined,
    'visibilitychange' | undefined
  ];
})();

const videoElement: HTMLVideoElement | null = document.getElementById(
  'videoElement'
) as HTMLVideoElement;

// If the page is hidden, pause the video;
// if the page is shown, play the video
function handleVisibilityChange() {
  const [hidden] = getHiddenProperty;
  if (hidden === undefined) {
    return;
  }
  console.log(document.visibilityState);
  if (document[hidden]) {
    videoElement?.pause();
  } else {
    videoElement?.play();
  }
}

export default () => {
  const [hidden, visibilityChange] = getHiddenProperty;
  // Warn if the browser doesn't support addEventListener or the Page Visibility API
  if (
    typeof document.addEventListener === 'undefined' ||
    hidden === undefined ||
    visibilityChange === undefined
  ) {
    console.log(
      'This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.'
    );
  } else {
    // Handle page visibility change
    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    // When the video pauses, set the title.
    // This shows the paused
    videoElement.addEventListener(
      'pause',
      () => {
        document.title = 'Paused';
      },
      false
    );

    // When the video plays, set the title.
    videoElement.addEventListener(
      'play',
      () => {
        document.title = 'Playing';
      },
      false
    );
  }
};
