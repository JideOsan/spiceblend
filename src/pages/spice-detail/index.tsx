import { useLocation, useNavigate } from 'react-router-dom';
import ArrowIcon from '../../assets/images/arrow-icon.svg?react';
import { motion } from 'framer-motion';
//import BlendTileCover from '../../components/BlendTileCover';
import { useSpice } from '../../api/spices/useSpice';
import SpiceTile from '../../components/SpiceTile';
import BlendTileCover from '../../components/BlendTileCover';

const SpiceDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { spice } = useSpice(location.pathname.replace('/spices/', ''));

  return (
    <div>
      <div className="relative flex flex-col h-screen">
        <div className="h-24 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="ml-6 text-gray-700 cursor-pointer flex items-center text-xl h rounded-full py-3.5 px-6"
          >
            <ArrowIcon className="w-5 h-5 mr-2 text-teal-500" />
            Go Back
          </button>
        </div>

        <div className="grow flex flex-col overflow-y-auto">
          <div className="h-36 pr-6 py-6">
            <h1 className="text-7xl text-gray-950 pl-10 w-ful inline">
              Spice Detail
            </h1>
          </div>
          <div className="ml-8 p-4 w-2xs h-88">
            {spice ? (
              <motion.div
                key={spice.id}
                initial={{ opacity: 0, scale: 1, translateY: '10px' }}
                animate={{ opacity: 1, scale: 1, translateY: '0px' }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                }}
                className="flex"
              >
                <SpiceTile spice={spice} />
              </motion.div>
            ) : (
              <></>
            )}
          </div>
          <div className="grow overflow-visible bg-coral-500/5 pl-10 py-10">
            <h2 className="w-full text-coral-500 text-xl mb-8 uppercase font-medium">
              Blends using this spice
            </h2>
            <div className="flex overflow-x-auto space-x-8 py-4 -ml-10 pl-10">
              {spice?.used_in_blends?.map((blend, index) => (
                <div key={blend.id} className="flex-shrink-0 w-64">
                  <motion.div
                    key={spice.id}
                    initial={{ opacity: 0, scale: 1, translateY: '10px' }}
                    animate={{ opacity: 1, scale: 1, translateY: '0px' }}
                    transition={{
                      duration: 1,
                      delay: index * 0.4,
                    }}
                    className="flex"
                  >
                    <BlendTileCover blend={blend} />
                  </motion.div>
                </div>
              ))}
              {(spice?.used_in_blends || []).length < 1 ? (
                <div className="w-2xs h-88 p-4 flex">
                  <div className=" border-4 flex p-8 text-center text-3xl justify-center items-center border-dashed text-gray-500 border-gray-500 rounded-3xl">
                    There are no blends using this spice
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiceDetail;
