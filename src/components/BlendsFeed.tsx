import { motion } from 'framer-motion';
import { useBlends } from '../data/useBlends';
import BlendTile from './BlendTile';

export default function BlendsFeed({ searchString }: { searchString: string }) {
  const { blends } = useBlends(searchString);

  return (
    <div>
      {blends.map((blend) => (
        <motion.div
          key={blend.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            //delay: isNewItem ? (index - spices.length) * 0.05 : 0,
          }}
          className="flex p-4"
        >
          <BlendTile blend={blend} />
        </motion.div>
      ))}
    </div>
  );
}
