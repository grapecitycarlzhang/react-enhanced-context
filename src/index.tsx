
import React, { createContext, useContext, useReducer, useCallback, FunctionComponent } from 'react';

export type EnhancedContextValueType = [any, any]
export type ActionType = { type: string, [payload: string]: any };
export type Reducers = { [reducer: string]: (state: any, action: ActionType, context?: any) => any }

export interface EnhancedContextProviderProps {
  reducers?: Reducers
  initialState?: any
  initializer?: undefined
}

export type PickedState = {}
export type Dispatch = (action: any) => void;

const rootReducer = (reducers?: Reducers) => (state: any, action: ActionType) => {
  if (action.type === '@@react-enhanced-context/merge') {
    const { key, context } = action.payload;
    return { ...state, [key]: { ...context } };
  } else if (action.type && reducers) {
    return Object.getOwnPropertyNames(state)
      .reduce((pre: any, key: string) => (pre[key] = reducers[key] ? reducers[key](state[key], action, state) : state[key], pre), {})
  }
  return state;
}

export default function createEnhancedContext<T>(defaultValue?: T, calculateChangedBits?: (prev: T, next: T) => number) {

  const context = defaultValue || {};

  const EnhancedContext = createContext<EnhancedContextValueType>(
    [context, () => context],
    calculateChangedBits ? (prev: EnhancedContextValueType, next: EnhancedContextValueType) => calculateChangedBits(prev[0], next[0]) : undefined);

  const EnhancedContextProvider: FunctionComponent<EnhancedContextProviderProps> = ({ reducers, initialState, initializer, ...rest }: EnhancedContextProviderProps) => (
    <EnhancedContext.Provider value={useReducer(useCallback(rootReducer(reducers), [reducers]), initialState || context, initializer)} {...rest} />
  );
  const EnhancedContextConsumer: FunctionComponent<any> = (props) => (
    <EnhancedContext.Consumer {...props} />
  );

  const useEnhancedContext = (key?: string): [PickedState, Dispatch] => {
    const [state, dispatch] = useContext(EnhancedContext) as any[];
    if (!key) {
      return [state, (action: ActionType) => dispatch(action)];
    }
    return [state[key], (context: any) => dispatch({ type: '@@react-enhanced-context/merge', payload: { key, context } })];
  };

  return {
    EnhancedContext,
    EnhancedContextProvider,
    EnhancedContextConsumer,
    useEnhancedContext
  }
}

const {
  EnhancedContext,
  EnhancedContextProvider,
  EnhancedContextConsumer,
  useEnhancedContext
} = createEnhancedContext();

export {
  EnhancedContext,
  EnhancedContextProvider,
  EnhancedContextConsumer,
  useEnhancedContext
}
