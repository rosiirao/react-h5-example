interface Document {
  wasDiscarded?: boolean;
}

interface Navigator {
  /** Windows download and save blob api */
  msSaveBlob: (blob: Blob, filename?: string) => void;
  /** Windows download and open blob api */
  msSaveOrOpenBlob: (blob: Blob, filename?: string) => void;
}

declare module '@testing-library/jest-dom/extend-expect';
