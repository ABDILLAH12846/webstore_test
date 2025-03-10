import React, { useCallback } from "react";

interface Props {
  children: React.ReactNode;
  onEndReached?: () => void;
}

export default function ScrollWrapper({ children, onEndReached }: Props) {
  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      onEndReached?.();
    }
  }, [onEndReached]);

  return (
    <div className="h-full overflow-y-auto" onScroll={onScroll}>
      {children}
    </div>
  );
}
