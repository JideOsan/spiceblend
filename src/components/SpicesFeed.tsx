import { useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import type { FixedSizeGrid, GridOnScrollProps } from 'react-window';
import { motion } from 'framer-motion';
import { useSpices } from '../data/useSpices';
import AutoSizer from 'react-virtualized-auto-sizer';
import { NavLink } from 'react-router-dom';
import SpiceTile from './SpiceTile';

const columnCount = 3;
const itemHeight = 352;
const itemWidth = 288;

export default function SpicesFeed({ searchString }: { searchString: string }) {
  const { fetchNextPage, hasNextPage, spices } = useSpices(searchString);

  const rowCount = Math.ceil(spices.length / columnCount);

  const gridRef = useRef<FixedSizeGrid>(null);
  const previousSpicesRef = useRef(new Set<string>());

  const handleScroll = useCallback(
    (props: GridOnScrollProps) => {
      if (gridRef.current) {
        sessionStorage.setItem(
          'spices-scroll-position',
          props.scrollTop.toString(),
        );
      }
    },
    [gridRef],
  );

  useEffect(() => {
    spices.forEach((spice) =>
      previousSpicesRef.current.add(spice.id.toString()),
    );
  }, [spices]);

  useEffect(() => {
    const savedPosition = sessionStorage.getItem('spices-scroll-position');
    if (savedPosition && gridRef.current) {
      gridRef.current.scrollTo({
        scrollLeft: 0,
        scrollTop: parseFloat(savedPosition),
      });
    }
  }, []);

  useLayoutEffect(() => {
    const savedScrollPosition = sessionStorage.getItem(
      'spices-scroll-position',
    );

    if (savedScrollPosition && gridRef.current) {
      gridRef.current.scrollTo({
        scrollLeft: 0,
        scrollTop: parseFloat(savedScrollPosition),
      });
    }
  });

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
          onScroll={handleScroll}
          onItemsRendered={({ visibleRowStopIndex }) => {
            loadMoreItems({ visibleRowStopIndex });
          }}
          ref={gridRef}
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
                  className="transition cursor-pointer hover:scale-[.99]"
                >
                  <SpiceTile spice={spice} />
                </NavLink>
              </motion.div>
            ) : null;
          }}
        </Grid>
      )}
    </AutoSizer>
  );
}
