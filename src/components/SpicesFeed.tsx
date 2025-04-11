import {
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import type { FixedSizeGrid, GridOnScrollProps } from 'react-window';
import { motion } from 'framer-motion';
import { useSpices } from '../api/spices/useSpices';
import AutoSizer from 'react-virtualized-auto-sizer';
import { NavLink } from 'react-router-dom';
import SpiceTile from './SpiceTile';
import { classNames } from '../helpers';

const columnCount = 3;
const itemHeight = 352;
const itemWidth = 288;

export default function SpicesFeed({ searchString }: { searchString: string }) {
  const { fetchNextPage, hasNextPage, spices } = useSpices(searchString);
  const [showHeader, setShowHeader] = useState(false);

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

      if (props.scrollTop > 40) {
        if (showHeader === true) setShowHeader(false);
      } else {
        if (showHeader === false) setShowHeader(true);
      }
    },
    [gridRef, showHeader, setShowHeader],
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
    <AutoSizer className="relative pl-4 w-full">
      {({ height, width }) => (
        <>
          <div
            style={{ width: width }}
            className={classNames(
              showHeader ? '' : '-translate-y-36',
              'transition absolute top-0 left-0 text-7xl h-36 z-1 pr-6',
            )}
          >
            <h1 className="py-6 pl-10 w-full bg-gray-50">Spices</h1>
          </div>
          <Grid
            columnCount={columnCount}
            columnWidth={itemWidth}
            height={height}
            rowCount={rowCount}
            rowHeight={itemHeight}
            width={width - 16}
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
                  style={{
                    ...style,
                    top: `${parseFloat((style.top ?? '0').toString()) + 144}px`,
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
                    className="transition cursor-pointer hover:scale-[.97] w-full"
                  >
                    <SpiceTile spice={spice} />
                  </NavLink>
                </motion.div>
              ) : null;
            }}
          </Grid>
        </>
      )}
    </AutoSizer>
  );
}
