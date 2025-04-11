// get blend API is at /api/v1/blends/:id
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowIcon from '../../assets/images/arrow-icon.svg?react';
import XIcon from '../../assets/images/x-icon.svg?react';
import PencilIcon from '../../assets/images/pencil-icon.svg?react';
import { useBlend } from '../../api/blends/useBlend';
import { AnimatePresence, motion } from 'framer-motion';
import BlendTile from '../../components/BlendTile';
import SpiceDrawer from '../../components/SpiceDrawer';
import { useCallback, useState } from 'react';
import { useUpdateBlend } from '../../api/blends/useUpdateBlend';

const BlendDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchString, updateSearchString] = useState('');
  const [editMode, setEditMode] = useState(false);

  const { blend } = useBlend(Number(location.pathname.replace('/blends/', '')));
  const { addSpice, removeSpice } = useUpdateBlend();

  const handleAdd = useCallback(
    async (spiceId: number) => blend && addSpice(blend, spiceId),
    [blend, addSpice],
  );

  const handleRemove = useCallback(
    async (spiceId: number) => blend && removeSpice(blend, spiceId),
    [blend, removeSpice],
  );

  return (
    <div>
      <div className="relative flex flex-col h-screen">
        <div className="h-24 flex shrink-0 items-center">
          <button
            onClick={() => navigate(-1)}
            className="ml-6 text-gray-700 cursor-pointer flex items-center text-xl h rounded-full py-3.5 px-6"
          >
            <ArrowIcon className="w-5 h-5 mr-2 text-teal-500" />
            Go Back
          </button>
        </div>

        <div className="grow">
          <div className="text-7xl h-36 pr-6 py-6">
            <h1 className="pl-10 w-full bg-gray-50 inline">Blend Detail</h1>
            {!blend?.locked && (
              <button
                type="button"
                onClick={() => setEditMode((current) => !current)}
                className="hover:scale-95 transition ml-5 cursor-pointer"
              >
                {editMode ? (
                  <XIcon className="w-8 h-8 mb-2 mr-2 text-coral-500 inline" />
                ) : (
                  <PencilIcon className="w-8 h-8 mb-2 mr-2 text-coral-500 inline" />
                )}
              </button>
            )}
          </div>
          <div className="p-4 h-96">
            {blend && (
              <motion.div
                key={blend.id}
                initial={{ opacity: 0, scale: 1, translateY: '10px' }}
                animate={{ opacity: 1, scale: 1, translateY: '0px' }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                }}
                className="flex"
              >
                <BlendTile
                  blend={blend}
                  editable={editMode}
                  onRemoveSpice={handleRemove}
                />
              </motion.div>
            )}
          </div>
          <div className="grow">
            <AnimatePresence>
              {editMode && (
                <motion.div
                  key="drawer"
                  initial={{ height: 0 }}
                  animate={{ height: 600 }}
                  exit={{ height: 0 }}
                  transition={{}}
                  className="overflow-hidden bg-teal-500 inset-shadow-lg"
                >
                  <div className="flex items-center px-14 py-14 ">
                    <input
                      className="text-5xl border-b-3 border-white/60 text-white/60 h-20 w-full focus:outline-none focus:border-white/90 focus:text-white/90 transition-colors px-1 py-2"
                      name={'spicedrawer-search'}
                      placeholder="Search For Spice"
                      value={searchString}
                      onChange={(e) => {
                        updateSearchString(e.target.value);
                      }}
                    />
                  </div>
                  <SpiceDrawer
                    searchString={searchString}
                    onSelectSpice={handleAdd}
                    selected={new Set(blend?.spice_ids)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlendDetail;
