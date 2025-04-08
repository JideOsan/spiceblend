import PepperIcon from '../assets/images/pepper-icon.svg?react';
import { Blend } from '../types';
import SpiceTile from './SpiceTile';

const getBlendImageUrl = (imageId: number) =>
  `/images/blends/${imageId % 3}.jpg`;

export default function BlendTile({ blend }: { blend: Blend }) {
  return (
    <div className="w-full h-88 p-4">
      <div className="w-full h-full overflow-clip relative rounded-3xl">
        <div className="absolute -m-4 inset-0 overflow-scroll">
          <div className="flex pl-72">
            {blend.resolved_spices?.map((spice) => (
              <div key={spice.id} className="w-2xs shrink-0 h-88 p-4">
                <SpiceTile spice={spice} />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-2xs h-88 -m-4 p-4">
          <div className="block relative w-full h-full">
            <div
              className="w-full h-full flex flex-col items-center rounded-3xl bg-gray-50 border border-gray-200 relative  transition cursor-pointer hover:scale-95"
              style={{ backgroundColor: blend.color }}
            >
              <div
                className="h-48 w-full relative overflow-hidden bg-cover rounded-t-3xl"
                style={{
                  backgroundImage: `url(${getBlendImageUrl(blend.id)})`,
                }}
              ></div>
              <div className="text-gray-950 flex w-full flex-col text-left items-start pt-4 p-5 grow justify-between">
                <div className="uppercase text-lg/4 font-medium">
                  {blend.name}
                </div>
                <div className="text-xs italic">{blend.description}</div>
                <div className="flex justify-between w-full">
                  <div className="-gap-x-4 flex">
                    {Array.from({ length: blend.heat || 0 }, (_, i) => (
                      <PepperIcon
                        key={`${blend.name}-${i}`}
                        className="h-5 w-5 -mx-1 inline text-gray-950/60 rotate-6"
                      />
                    ))}
                  </div>
                  <div className="text-gray-950/50 font-bold">
                    {blend.price}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
