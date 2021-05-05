import {useReducer} from 'react';

export enum PtrStatus {
  Pending,
  Ready,
  Fullfil,
  Loading,
}

interface IState {
  readonly state: PtrStatus;
  move?: () => IState;
  release?: () => IState;
  fullfil?: () => IState;
  done?: () => IState;
  cancel?: () => IState;
}

const Pending: IState = {
  state: PtrStatus.Pending,
  move: () => Ready,
  fullfil: () => Fullfil,
  release: () => Pending,
  cancel: () => Pending,
};

const Ready: IState = {
  state: PtrStatus.Ready,
  move: () => Ready,
  release: () => Pending,
  fullfil: () => Fullfil,
  cancel: () => Pending,
};

const Fullfil: IState = {
  state: PtrStatus.Fullfil,
  fullfil: () => Fullfil,
  release: () => Loading,
  move: () => Ready,
  cancel: () => Pending,
};

const Loading: IState = {
  state: PtrStatus.Loading,
  done: () => Pending,
};

const reducer: React.Reducer<IState, Exclude<keyof IState, 'state'>> = (
  state,
  action
) => {
  const nextState = state[action]?.();
  if (nextState === undefined)
    throw new Error(
      `not supported action: ${action} on PtrStatus: ${PtrStatus[state.state]}`
    );
  return nextState;
};

export default () => {
  return useReducer(reducer, Pending);
};
