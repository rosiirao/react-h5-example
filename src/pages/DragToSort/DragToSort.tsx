import React, {useCallback, useEffect, useRef, useState} from 'react';
import './DragToSort.scss';
import DroppedFilesForm from './DroppedFilesForm';
import {postFormAsURLSchema} from '../../helper/post-data';

export default function DragToSort() {
  const droppedFilesForm = useRef<HTMLFormElement>(null);
  const [log, setLog] = useState<string[]>([]);
  const [list, setList] = useState<{id: number; text: string}[]>([
    {id: 1, text: 'first'},
    {id: 2, text: 'second'},
  ]);
  // drag upload files
  const [files, setFiles] = useState<{index: number; name: string}[]>([]);

  // drag over zone state
  const [{isDragover, droppingId, droppedId}, setDragState] = useState({
    isDragover: false,
    droppingId: NaN, // the id on drag over
    droppedId: undefined as
      | {
          insertId: number;
          draggedId: number;
        }
      | undefined,
  });
  const dropZone = useRef<HTMLUListElement>(null);
  const drop_content = '😫';
  const logTarget = (e: HTMLElement, title: string) =>
    `${title}: offsetTop: ${e.offsetTop}, text: ${e.innerText}`;

  const handleDragOver: React.DragEventHandler<HTMLElement> = useCallback(
    ev => {
      ev.preventDefault();
      // ev.dataTransfer.effectAllowed = 'uninitialized';
      const target = ev.target as HTMLElement; // dragover item
      const currentTarget = ev.currentTarget as HTMLElement; // dragover zone
      const targetId = target.dataset['id'];
      switch (ev.dataTransfer.effectAllowed) {
        case 'move':
        case 'copyMove' /** safari */:
          ev.dataTransfer.dropEffect = 'move';
          break;
        case 'copy':
          ev.dataTransfer.dropEffect = 'copy';
          break;
        default:
          if (ev.dataTransfer.types.includes('Files')) {
            ev.dataTransfer.dropEffect = 'copy';
            break;
          }
          ev.dataTransfer.dropEffect = 'none';
          return;
      }
      setDragState(() => ({
        isDragover: true,
        droppingId: Number(targetId),
        droppedId: undefined,
      }));
      setLog(prevLog => {
        return [
          logTarget(currentTarget, 'handleDragOver:currentTarget'),
          logTarget(target, 'handleDragOver:dragOvertTarget'),
          ...prevLog,
        ].splice(0, 8);
      });
    },
    []
  );

  const handleDragLeave: React.DragEventHandler<HTMLElement> = useCallback(
    ev => {
      // safari will trigger dragleave event when over the child element in the drop zone
      // if it is files, we can't set dropEffect, otherwise the drop event won't triggered in safari
      if (!ev.dataTransfer.types.includes('Files')) {
        ev.dataTransfer.dropEffect = 'none';
      }
      setDragState(item => ({
        ...item,
        isDragover: false,
        droppedId: undefined,
      }));

      const target = ev.target as HTMLElement;
      setLog(prevLog =>
        [
          logTarget(target, 'handleDragLeave:dragLeaveTarget'),
          ...prevLog,
        ].splice(0, 8)
      );
    },
    []
  );

  const handleDrop: React.DragEventHandler<HTMLElement> = useCallback(ev => {
    ev.preventDefault();
    ev.stopPropagation(); // do this to prevent the redirect

    const target = ev.target as HTMLDivElement; // dragged avatar
    const currentTarget = ev.currentTarget as HTMLUListElement; // dragover zone
    setLog(prevLog => {
      return [`drop files: ${ev.dataTransfer.files.length}`, ...prevLog].splice(
        0,
        8
      );
    });
    const draggedId = ev.dataTransfer.getData('text');
    // on drop can get files by ev.dataTransfer.files interface.
    const files = ev.dataTransfer.files;
    if (files.length > 0) {
      let dropFilesInput = droppedFilesForm.current!
        .children[0] as HTMLInputElement;
      if (dropFilesInput === undefined) {
        dropFilesInput = document.createElement('input');
        dropFilesInput.setAttribute('type', 'file');
        dropFilesInput.setAttribute('multiple', 'true');
        droppedFilesForm.current?.appendChild(dropFilesInput);
      }
      dropFilesInput.files = files;
      const fileState = [];
      for (const {name} of files) {
        fileState.push({index: droppingId, name});
      }
      setFiles(fileState);
    }
    setDragState(({droppingId}) => ({
      isDragover: false,
      droppingId: NaN,
      droppedId: {
        insertId: droppingId,
        draggedId: Number(draggedId),
      },
    }));
    setLog(prevLog => {
      return [
        logTarget(currentTarget, 'handleDrop:currentTarget'),
        logTarget(target, 'handleDrop:dragOvertTarget'),
        ...prevLog,
      ].splice(0, 8);
    });
  }, []);

  const handleDragStart: React.DragEventHandler<HTMLElement> = useCallback(
    ev => {
      const target = ev.target as HTMLElement; // dragged element
      // target.style.opacity = '0.5';
      // target.innerHTML = drop_content;
      const moveId = target.dataset['id'] ?? NaN;
      ev.dataTransfer.setData('text/plain', String(moveId));
      if (isNaN(Number(moveId))) {
        ev.dataTransfer.effectAllowed = 'copy';
      } else {
        ev.dataTransfer.effectAllowed = 'move';
      }
      ev.dataTransfer.dropEffect = 'none';

      // const target = evt.target;
      setLog(prevLog => {
        return [
          logTarget(target, 'dragStartTarget'),
          logTarget(dropZone.current!, 'dropZone'),
          ...prevLog,
        ].splice(0, 8);
      });
    },
    []
  );

  const handleDragEnd: React.DragEventHandler<HTMLElement> = useCallback(() => {
    // drag end event can't get ev.dataTransfer.types;
    setDragState(item => ({...item, isDragover: false, droppingId: NaN}));
    setLog(prevLog => ['handleDragEnd', ...prevLog].splice(0, 8));
  }, []);

  useEffect(() => {
    setLog(prevLog => [`droppingId: ${droppingId}`, ...prevLog].splice(0, 8));
  }, [droppingId]);

  useEffect(() => {
    const {insertId = NaN, draggedId = NaN} = droppedId || {};
    if (isNaN(insertId)) return;
    if (draggedId === insertId) return;

    setList(prevList => {
      // get the maxId + 1 from the list if not drag to move
      const itemId = isNaN(draggedId)
        ? prevList.reduce((nextId, {id}) => {
            if (id >= nextId) {
              return id + 1;
            }
            return nextId;
          }, 0)
        : draggedId;
      // create new item if not drag to move
      const item = isNaN(draggedId)
        ? {id: itemId, text: `${itemId}:${drop_content}`}
        : prevList.find(({id}) => id === draggedId)!;

      if (item === undefined) {
        // not drag prevList item, then exit
        return prevList;
      }

      if (!isNaN(draggedId)) {
        prevList = prevList.filter(li => li !== item);
      }
      if (insertId === Infinity) {
        return [...prevList, item];
      }
      if (insertId === -Infinity) {
        return [item, ...prevList];
      }
      const index = prevList.findIndex(({id}) => id === insertId);
      return prevList.reduce((list, li, i) => {
        list.push(li);
        if (i === index) {
          list.push(item);
        }
        return list;
      }, [] as typeof list);
    });
    setDragState(() => ({
      isDragover: false,
      droppingId: NaN,
      droppedId: undefined,
    }));
  }, [droppedId]);

  useEffect(() => {
    if (files.length > 0) {
      // can upload files here
      // dropFilesForm.current?.submit();
      const form = new FormData(droppedFilesForm.current!);
      postFormAsURLSchema(droppedFilesForm.current!.action, form);
      // form.
    }
  }, [files]);

  const isDragoverList = isDragover || !isNaN(droppingId);
  return (
    <>
      <div
        draggable
        className="drag-content"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        🤓
      </div>
      <div className="drop-monitor">
        <ul
          className={`drop-list${
            isDragoverList ? ' drop-list--drag-over' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          ref={dropZone}
        >
          {isDragoverList ? (
            <li
              data-id={-Infinity}
              className={`drop-list__item drop-list__item--pseudo${
                -Infinity === droppingId ? ' u-dropping-after' : ''
              }`}
            >
              beforeFirst
            </li>
          ) : null}
          {list.map(({id, text}) => (
            <li
              className={`drop-list__item${
                id === droppingId ? ' u-dropping-after' : ''
              }`}
              draggable={true}
              onDragStart={handleDragStart}
              data-id={id}
              key={id}
            >
              {text}
            </li>
          ))}
          {isDragoverList ? (
            <li
              data-id={Infinity}
              className={`drop-list__item drop-list__item--pseudo${
                Infinity === droppingId ? ' u-dropping-after' : ''
              }`}
            >
              afterLast
            </li>
          ) : null}
        </ul>
        <div className="drop-log">
          {log.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
      <DroppedFilesForm files={files} ref={droppedFilesForm} />
    </>
  );
}

DragToSort.displayName = 'DragToSort';
