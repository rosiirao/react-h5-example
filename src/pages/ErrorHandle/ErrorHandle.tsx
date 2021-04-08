import ErrorBoundaries from './ErrorBoundaries';
import Err from './AErrorComponent';

export default () => {
  return (
    // In development env you will always see the error overlay
    //   unless you turn it off or close it with the X button.
    <ErrorBoundaries>
      <Err></Err>
    </ErrorBoundaries>
  );
};
