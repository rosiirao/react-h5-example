import React, {forwardRef} from 'react';

const DroppedFilesForm = (
  {files}: {files: {name: string}[]},
  dropFilesForm: React.ForwardedRef<HTMLFormElement>
) => {
  return (
    <p>
      <form
        className="dropped-files__form"
        method="post"
        action="/file"
        ref={dropFilesForm}
      ></form>
      <ul className="dropped-files__list">
        {files.map(({name}) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </p>
  );
};

// getName(DroppedFilesForm) === 'DroppedFilesForm';
DroppedFilesForm.displayName = 'DroppedFilesForm';

export default forwardRef(DroppedFilesForm);
