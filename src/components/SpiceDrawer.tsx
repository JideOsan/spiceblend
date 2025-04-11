import { useCallback, useRef, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { FixedSizeList } from 'react-window';
import { motion } from 'framer-motion';
import { useSpices } from '../api/spices/useSpices';
import AutoSizer from 'react-virtualized-auto-sizer';
import SpiceTile from './SpiceTile';
import CheckIcon from './../assets/images/check-icon.svg?react';

const columnCount = 3;
const itemHeight = 352;
const itemWidth = 288;

export default function SpiceDrawer({
  searchString,
  onSelectSpice,
  selected,
}: {
  searchString: string;
  onSelectSpice: (spice_id: number) => Promise<void>;
  selected: Set<number>;
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
                <div
                  onClick={() => onSelectSpice(spice.id)}
                  className="transition cursor-pointer hover:scale-[.99] w-full h-full relative"
                >
                  {selected.has(spice.id) ? (
                    <div className="absolute -right-4 top-6 shadow-lg bg-teal-200 h-8 w-8 flex items-center justify-center rounded-full">
                      <CheckIcon className="w-5 h-5 text-teal-500" />
                    </div>
                  ) : (
                    <></>
                  )}
                  <SpiceTile
                    className="shadow-lg shadow-gray-950/20"
                    spice={spice}
                  />
                </div>
              </motion.div>
            ) : null;
          }}
        </List>
      )}
    </AutoSizer>
  );
}
