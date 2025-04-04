import { useCallback, useRef, useEffect } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { motion } from 'framer-motion';
import { useSpices } from '../data/useSpices';
import AutoSizer from 'react-virtualized-auto-sizer';
import PepperIcon from '../assets/images/pepper-icon.svg?react';

const columnCount = 3;
const itemHeight = 352;
const itemWidth = 288;
const getSpiceImageUrl = (imageId: number) => `/images/${imageId % 10}.png`;

export default function SpicesFeed({ searchString }: { searchString: string }) {
  const { fetchNextPage, hasNextPage, spices } = useSpices(searchString);

  const rowCount = Math.ceil(spices.length / columnCount);

  const previousSpicesRef = useRef(new Set<string>());

  useEffect(() => {
    spices.forEach((spice) =>
      previousSpicesRef.current.add(spice.id.toString()),
    );
  }, [spices]);

  const loadMoreItems = useCallback(
    ({ visibleRowStopIndex }: { visibleRowStopIndex: number }) => {
      if (visibleRowStopIndex >= rowCount - 1 && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, rowCount],
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <Grid
          columnCount={columnCount}
          columnWidth={itemWidth}
          height={height}
          rowCount={rowCount}
          rowHeight={itemHeight}
          width={width}
          onItemsRendered={({ visibleRowStopIndex }) => {
            loadMoreItems({ visibleRowStopIndex });
          }}
        >
          {({ columnIndex, rowIndex, style }) => {
            const index = rowIndex * columnCount + columnIndex;
            const spice = spices[index];
            const isNewItem = !previousSpicesRef.current.has(
              spice?.id.toString(),
            );
            return spice ? (
              <motion.div
                key={spice.id}
                style={{ ...style }}
                //initial={{ opacity: 0, scale: 0.8 }}
                initial={isNewItem ? { opacity: 0, scale: 0.8 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 1 /*, delay: isNewItem ? (index - spices.length) * 0.05 : 0,*/,
                }}
                className="flex p-4"
              >
                <div className="w-full h-full bg-gray-50 rounded-2xl border border-gray-4">
                  <div className="w-full h-full flex flex-col items-center">
                    <div className="h-48 w-48 relative overflow-hidden">
                      <img
                        src={getSpiceImageUrl(spice.id)}
                        className="h-48 w-48 absolute"
                        alt="Spice"
                      />
                    </div>
                    <div className="text-black flex flex-col text-center items-center pt-0 p-6 grow justify-between">
                      <div className="uppercase text-sm/4 font-medium">
                        {spice.name}
                      </div>
                      <div className="text-xs italic">{spice.description}</div>
                      <div className="flex justify-between w-full px-6">
                        <div className="-gap-x-4 flex">
                          {Array.from({ length: spice.heat }, (_, i) => (
                            <PepperIcon
                              key={`${spice.name}-${i}`}
                              className="h-5 w-5 -mx-1 inline text-mustard-1 rotate-6"
                            />
                          ))}
                        </div>
                        <div className="text-black/50 font-bold">
                          {spice.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null;
          }}
        </Grid>
      )}
    </AutoSizer>
  );
}
