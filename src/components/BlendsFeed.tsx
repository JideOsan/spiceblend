import { motion } from 'framer-motion';
import { useBlends } from '../api/blends/useBlends';
import BlendTile from './BlendTile';
import { classNames } from '../helpers';

export default function BlendsFeed({ searchString }: { searchString: string }) {
  const { blends } = useBlends(searchString);

  return (
    <div className="relative pt-36">
      <div
        className={classNames(
          'transition absolute top-0 left-0 right-0 text-7xl h-36 z-1 pr-6',
        )}
      >
        <h1 className="py-6 pl-10 w-full bg-gray-50">Blends</h1>
      </div>
      {blends.map((blend, index) => (
        <motion.div
          key={blend.id}
          initial={{ opacity: 0, scale: 1, translateY: '10px' }}
          animate={{ opacity: 1, scale: 1, translateY: '0px' }}
          transition={{
            duration: 1,
            delay: index * 0.4,
          }}
          className="flex"
        >
          <BlendTile to={`/blends/${blend.id}`} blend={blend} />
        </motion.div>
      ))}
    </div>
  );
}
