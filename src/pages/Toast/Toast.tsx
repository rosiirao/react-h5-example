import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import './Toast.scss';

interface Toast {
  open: () => void;
  close: () => void;
}

const _Window = (props: React.PropsWithChildren<{}>, ref: React.Ref<Toast>) => {
  const {children} = props;
  const [opened, setOpened] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        setOpened(true);
      },
      close: () => {
        setOpened(false);
      },
    }),
    []
  );

  const closeDialog = useCallback(() => {
    setOpened(false);
  }, []);
  return opened
    ? ReactDOM.createPortal(
        <div className="dialog" onClick={closeDialog}>
          <button className="dialog__button">X</button>
          {children}
        </div>,
        document.body
      )
    : null;
};

const Toast = forwardRef<Toast, React.PropsWithChildren<{}>>(_Window);

export default () => {
  const dialogRef = useRef<Toast>(null);
  const dialog = useMemo<Toast>(
    () => ({
      open: () => dialogRef.current?.open(),
      close: () => dialogRef.current?.close(),
    }),
    [dialogRef]
  );
  return (
    <React.Fragment>
      <button type="button" onClick={dialog.open}>
        open modal dialog
      </button>
      <Toast ref={dialogRef}>
        <div>Hello Modal!</div>
        <div>Hello Modal!</div>
        <div>Hello Modal!</div>
      </Toast>
    </React.Fragment>
  );
};
