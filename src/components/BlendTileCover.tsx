import PepperIcon from '../assets/images/pepper-icon.svg?react';
import { classNames, getContrastTextColor } from '../helpers';
import { Blend } from '../types';
import { MaybeLink } from './MaybeLink';

export default function BlendTileCover({
  blend,
  className,
  cardClassName,
  to,
}: {
  blend: Blend;
  className?: string;
  cardClassName?: string;
  to?: string;
}) {
  return (
    <div className={classNames(className || '', 'w-2xs h-88 -m-4 p-4')}>
      <div className="block relative w-full h-full">
        <MaybeLink to={to} className="w-full h-full">
          <div
            className={classNames(
              to ? 'transition cursor-pointer hover:scale-95' : '',
              cardClassName || '',
              'w-full h-full flex flex-col items-center rounded-3xl bg-gray-50 border border-gray-200 relative',
            )}
            style={{ backgroundColor: blend.color }}
          >
            {blend.image ? (
              <div
                className="h-48 w-full relative overflow-hidden bg-cover rounded-t-3xl"
                style={{
                  backgroundImage: `url(${blend.image})`,
                }}
              />
            ) : (
              <div className="h-48 w-full relative overflow-hidden bg-cover bg-gray-600 flex text-lg items-center justify-center text-white rounded-t-3xl">
                This blend has no image
              </div>
            )}
            <div
              className="text-gray-950 flex w-full flex-col text-left items-start pt-4 p-5 grow justify-between"
              style={{ color: getContrastTextColor(blend.color) }}
            >
              <div className="uppercase text-lg/4 font-medium">
                {blend.name}
              </div>
              <div className="text-xs italic">{blend.description}</div>
              <div className="flex justify-between w-full">
                <div className="-gap-x-4 flex">
                  {Array.from({ length: blend.heat || 0 }, (_, i) => (
                    <PepperIcon
                      key={`${blend.name}-${i}`}
                      className="h-5 w-5 -mx-1 inline opacity-60 rotate-6"
                    />
                  ))}
                </div>
                <div className="opacity-50 font-bold">{blend.price}</div>
              </div>
            </div>
          </div>
        </MaybeLink>
      </div>
    </div>
  );
}
