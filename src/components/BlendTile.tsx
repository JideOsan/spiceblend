import { Blend } from '../types';
import BlendTileCover from './BlendTileCover';
import SpiceTile from './SpiceTile';
import PaintBrushIcon from './../assets/images/paint-icon.svg?react';
import XIcon from './../assets/images/x-icon.svg?react';
import { MaybeLink } from './MaybeLink';
import { classNames } from '../helpers';
import { useModal } from '../hooks/useModal';

export default function BlendTile({
  blend,
  to,
  editable,
  onRemoveSpice,
}: {
  blend: Blend;
  to?: string;
  editable?: boolean;
  onRemoveSpice?: (id: number) => Promise<void>;
}) {
  const { openModal } = useModal();
  return (
    <div className="w-full h-88 p-4">
      <div className="w-full h-full overflow-visible relative rounded-3xl">
        <div className="absolute -m-4 inset-0 overflow-scroll flex no-scrollbar">
          <div className="w-2xs shrink-0 h-88 p-4 sticky left-0 z-10">
            <BlendTileCover
              blend={blend}
              to={to}
              className="sticky top-0 left-0"
            />
            {editable && (
              <button
                type="button"
                onClick={() => openModal('edit-blend')}
                className="absolute right-0 top-44 cursor-pointer transition z-10 hover:scale-105 shadow-lg bg-gray-500 h-8 w-8 flex items-center justify-center rounded-full "
              >
                <PaintBrushIcon className="w-5 h-5 text-gray-800" />
              </button>
            )}
          </div>

          {blend.resolved_spices?.map((spice, index, arr) => (
            <div
              key={spice.id}
              style={
                index === arr.length - 1
                  ? { marginRight: 'calc(100vw - 578px)' }
                  : {}
              }
              className="w-2xs shrink-0 h-88 p-4 sticky left-0 z-1"
            >
              {editable && (
                <button
                  type="button"
                  onClick={() => onRemoveSpice && onRemoveSpice(spice.id)}
                  className="absolute right-0 top-8 cursor-pointer transition z-1 hover:scale-105 shadow-lg bg-gray-500 h-8 w-8 flex items-center justify-center rounded-full "
                >
                  <XIcon className="w-5 h-5 text-gray-800" />
                </button>
              )}
              <MaybeLink
                to={editable ? undefined : `/spices/${spice.id}`}
                className={classNames(
                  editable ? '' : 'transition cursor-pointer hover:scale-[.97]',
                  'w-full h-full',
                )}
              >
                <SpiceTile spice={spice} />
              </MaybeLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
