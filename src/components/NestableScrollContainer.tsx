import React from 'react';
import { LayoutChangeEvent, ScrollViewProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import {
  NestableScrollContainerProvider,
  useSafeNestableScrollContainerContext,
} from '../context/nestableScrollContainerContext';
import { useStableCallback } from '../hooks/useStableCallback';

function NestableScrollContainerInner(props: ScrollViewProps) {
  const {
    containerSize,
    scrollViewSize,
    scrollableRef,
    outerScrollEnabled,
  } = useSafeNestableScrollContainerContext();

  // const onScroll = useAnimatedScrollHandler({
  //   onScroll: ({ contentOffset }) => {
  //     outerScrollOffset.value = contentOffset.y;
  //   },
  // });

  const onLayout = useStableCallback((event: LayoutChangeEvent) => {
    const {
      nativeEvent: { layout },
    } = event;
    containerSize.value = layout.height;
  });

  const onContentSizeChange = useStableCallback((w: number, h: number) => {
    scrollViewSize.value = h;
    props.onContentSizeChange?.(w, h);
  });

  return (
    <Animated.ScrollView
      {...props}
      ref={scrollableRef}
      onLayout={onLayout}
      onContentSizeChange={onContentSizeChange}
      scrollEnabled={outerScrollEnabled}
      scrollEventThrottle={1}
    />
  );
}

export const NestableScrollContainer = React.forwardRef(
  (props: ScrollViewProps, forwardedRef?: React.ForwardedRef<ScrollView>) => {
    return (
      <NestableScrollContainerProvider
        forwardedRef={(forwardedRef as React.MutableRefObject<ScrollView>) || undefined}
      >
        <NestableScrollContainerInner {...props} />
      </NestableScrollContainerProvider>
    );
  }
);
