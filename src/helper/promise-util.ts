const createPromise = <T, E extends Error = Error>() => {
  let ok: (value: T) => void, err: (err: E) => void;
  const p = new Promise<T>((r, j) => {
    ok = r;
    err = j;
  });
  return [p, ok!, err!] as const;
};

export default createPromise;
