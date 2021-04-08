import React, {ErrorInfo} from 'react';

export default class extends React.Component<
  React.PropsWithChildren<{}>, // props
  {error?: Error; errorInfo?: ErrorInfo}, // state
  unknown // snapshot
> {
  constructor(props: React.PropsWithChildren<Record<string, string>>) {
    super(props);
    this.state = {error: undefined, errorInfo: undefined};
  }

  /**
   * This lifecycle is invoked after an error has been thrown by a descendant component.
   * getDerivedStateFromError() is called during the “render” phase, so side-effects are not permitted.
   * @param error
   * @returns
   */
  static getDerivedStateFromError(error: Error) {
    console.log('getDerivedStateFromError');
    // update state so the next render will show the fallback UI.
    return {error, errorInfo: error.stack || error.message};
  }

  /**
   * This lifecycle is invoked after an error has been thrown by a descendant component.
   * componentDidCatch() is called during the “commit” phase, so side-effects are permitted.
   *
   * In the event of an error, you can render a fallback UI with componentDidCatch() by calling setState,
   *  but this will be deprecated in a future release.
   *  Use static getDerivedStateFromError() to handle fallback rendering instead.
   *
   * On development, the errors will bubble up to window,
   *  this means that any window.onerror or window.addEventListener('error', callback)
   *  will intercept the errors that have been caught by componentDidCatch().
   * On production, instead, the errors will not bubble up,
   *  which means any ancestor error handler will only receive errors not explicitly caught by componentDidCatch().
   * @param error
   * @param errorInfo
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Catch errors in any components below and re-render with error message
    console.log('componentDidCatch');
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <>
          <h2>Something went wrong.</h2>
          <details style={{whiteSpace: 'pre-wrap'}}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </>
      );
    }
    return this.props.children;
  }
}
