import PepperIcon from '../assets/images/pepper-icon.svg?react';
import { classNames } from '../helpers';
import { Spice } from '../types';

const getSpiceImageUrl = (imageId: number) =>
  `/images/spices/${imageId % 10}.png`;

export default function SpiceTile({
  spice,
  className,
}: {
  spice: Spice;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        className ? className : 'shadow-lg shadow-gray-400/40',
        'block w-full h-full bg-gray-75 rounded-3xl border border-gray-400 transition',
      )}
    >
      <div className="w-full h-full flex flex-col items-center">
        <div className="h-48 w-48 relative overflow-hidden">
          <img
            src={getSpiceImageUrl(spice.id)}
            className="h-48 w-48 absolute"
            alt="Spice"
          />
        </div>
        <div className="text-gray-950 flex flex-col text-center items-center pt-0 p-6 grow justify-between">
          <div className="uppercase text-sm/4 font-medium">{spice.name}</div>
          <div className="text-xs italic">{spice.description}</div>
          <div className="flex justify-between w-full px-6">
            <div className="-gap-x-4 flex">
              {Array.from({ length: spice.heat }, (_, i) => (
                <PepperIcon
                  key={`${spice.name}-${i}`}
                  className="h-5 w-5 -mx-1 inline text-mustard-500 rotate-6"
                />
              ))}
            </div>
            <div className="text-gray-950/50 font-bold">{spice.price}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
