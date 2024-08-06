import React, { useContext } from 'react';
import { useMemo, useRef } from 'react';
import Animated, { AnimatedRef, useAnimatedRef, WithSpringConfig } from 'react-native-reanimated';
import { DEFAULT_PROPS } from '../constants';
import { useProps } from './propsContext';
import { CellData, DraggableFlatListProps } from '../types';

type RefContextValue<T> = {
  propsRef: React.MutableRefObject<DraggableFlatListProps<T>>;
  animConfig: WithSpringConfig;
  cellDataRef: React.MutableRefObject<Map<string, CellData>>;
  keyToIndexRef: React.MutableRefObject<Map<string, number>>;
  containerRef: React.RefObject<Animated.View>;
  flatlistRef: AnimatedRef<Animated.FlatList<T>>;
};
const RefContext = React.createContext<RefContextValue<any> | undefined>(undefined);

export default function RefProvider<T>({ children }: { children: React.ReactNode }) {
  const value = useSetupRefs<T>();
  return <RefContext.Provider value={value}>{children}</RefContext.Provider>;
}

export function useRefs<T>() {
  const value = useContext(RefContext);
  if (!value) {
    throw new Error('useRefs must be called from within a RefContext.Provider!');
  }
  return value as RefContextValue<T>;
}

function useSetupRefs<T>() {
  const props = useProps<T>();

  const { animationConfig = DEFAULT_PROPS.animationConfig } = props;

  const propsRef = useRef(props);

  propsRef.current = props;
  const animConfig = useMemo(
    () => ({
      ...DEFAULT_PROPS.animationConfig,
      ...animationConfig,
    }),
    [animationConfig]
  );

  const cellDataRef = useRef(new Map<string, CellData>());
  const keyToIndexRef = useRef(new Map<string, number>());

  const containerRef = useRef<Animated.View>(null);
  const flatlistRef = useAnimatedRef<Animated.FlatList<T>>();

  const refs = useMemo(
    () => ({
      animConfig,
      cellDataRef,
      containerRef,
      flatlistRef,
      keyToIndexRef,
      propsRef,
    }),
    []
  );

  return refs;
}
