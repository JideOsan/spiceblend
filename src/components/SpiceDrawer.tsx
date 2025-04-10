import { useCallback, useRef, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { FixedSizeList } from 'react-window';
import { motion } from 'framer-motion';
import { useSpices } from '../api/spices/useSpices';
import AutoSizer from 'react-virtualized-auto-sizer';
import { NavLink } from 'react-router-dom';
import SpiceTile from './SpiceTile';

const columnCount = 3;
const itemHeight = 352;
const itemWidth = 288;

export default function SpiceDrawer({
  searchString,
}: {
  searchString: string;
}) {
  const { fetchNextPage, hasNextPage, spices } = useSpices(searchString);

  const gridRef = useRef<FixedSizeList>(null);
  const previousSpicesRef = useRef(new Set<string>());

  useEffect(() => {
    spices.forEach((spice) =>
      previousSpicesRef.current.add(spice.id.toString()),
    );
  }, [spices]);

  const loadMoreItems = useCallback(
    ({ visibleStopIndex }: { visibleStopIndex: number }) => {
      if (visibleStopIndex >= columnCount - 1 && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage],
  );

  return (
    <AutoSizer className="relative w-full">
      {({ width }) => (
        <List
          itemCount={spices.length}
          itemSize={itemWidth}
          layout="horizontal"
          height={itemHeight}
          width={width}
          onItemsRendered={({ visibleStopIndex }) => {
            loadMoreItems({ visibleStopIndex });
          }}
          ref={gridRef}
        >
          {({ index, style }) => {
            const spice = spices[index];
            const isNewItem = !previousSpicesRef.current.has(
              spice?.id.toString(),
            );
            return spice ? (
              <motion.div
                key={spice.id}
                style={{
                  ...style,
                  left: `${parseFloat((style.left ?? '0').toString()) + 40}px`,
                }}
                initial={isNewItem ? { opacity: 0, scale: 0.8 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 1,
                  delay: isNewItem ? (index - spices.length) * 0.05 : 0,
                }}
                className="flex p-4"
              >
                <NavLink
                  to={`/spices/${spice.id}`}
                  className="transition cursor-pointer hover:scale-[.99] w-full"
                >
                  <SpiceTile
                    className="shadow-lg shadow-gray-950/20"
                    spice={spice}
                  />
                </NavLink>
              </motion.div>
            ) : null;
          }}
        </List>
      )}
    </AutoSizer>
  );
}
