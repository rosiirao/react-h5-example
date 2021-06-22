import {
  EventHandler,
  SyntheticEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import {encodeToContainer, svgToImageSrc} from './Util';

type Props = React.PropsWithChildren<{
  updateCodeImage: (src: string) => void;
}>;
export default function QRWriter(props: Props) {
  const {updateCodeImage} = props;

  const [textToEncode, setTextToEncode] = useState('');
  const encodedContainer = useRef<HTMLDivElement>(null);
  const onChangeEncodedText = useCallback<
    React.ChangeEventHandler<HTMLTextAreaElement>
  >(
    e => {
      setTextToEncode(e.target.value);
    },
    [setTextToEncode]
  );
  const encodeText: EventHandler<SyntheticEvent<HTMLElement, Event>> = e => {
    e.preventDefault();
    if (textToEncode === '') return;
    const container = encodedContainer.current;
    if (container === null) {
      alert(
        'The page is not loaded completed, please retry a few minutes later!'
      );
      return;
    }
    container.childNodes.forEach(c => c.remove());
    encodeToContainer(container, textToEncode);
    const svg = container.querySelector('svg') as SVGElement;
    svg.style.background = 'white';
    updateCodeImage(svgToImageSrc(svg));
  };

  return (
    <form className="qr-writer" onSubmit={encodeText}>
      <h3>QR Encoder</h3>
      <label>
        Text:
        <textarea
          placeholder="input the content to encode"
          value={textToEncode}
          onChange={onChangeEncodedText}
          required
        />
      </label>
      <button type="submit">Encode Text</button>
      <button type="reset">Reset Writer</button>
      <div hidden ref={encodedContainer}></div>
    </form>
  );
}
