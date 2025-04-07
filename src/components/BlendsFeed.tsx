import { motion } from 'framer-motion';
import { useBlends } from '../data/useBlends';
import BlendTile from './BlendTile';

export default function BlendsFeed({ searchString }: { searchString: string }) {
  const { blends } = useBlends(searchString);

  return (
    <div>
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
          <BlendTile blend={blend} />
        </motion.div>
      ))}
    </div>
  );
}
