import { Blend } from '../types';
import BlendTileCover from './BlendTileCover';
import SpiceTile from './SpiceTile';

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
        <BlendTileCover blend={blend} cardClassName="transition cursor-pointer hover:scale-95" className="absolute top-0 left-0" />
      </div>
    </div>
  );
}
