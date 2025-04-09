import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HexColorPicker } from 'react-colorful';
import BlendTileCover from './BlendTileCover';
import PaintBrushIcon from './../assets/images/paint-icon.svg?react';
import PhotoIcon from './../assets/images/camera-icon.svg?react';

type BlendFormValues = {
  name: string;
  description: string;
};

const CreateBlendForm = () => {
  const { register, watch, handleSubmit } = useForm<BlendFormValues>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const name = watch('name');
  const description = watch('description');

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#f5f5f5');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const onSubmit = (data: BlendFormValues) => {
    const blendData = {
      ...data,
      backgroundColor,
      coverImage,
    };
    console.log(blendData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverImage(file);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-6 p-12 max-w-5xl mx-auto bg-cream rounded-3xl shadow-xl border border-gray-700"
    >
      <h2 className="col-span-2 text-xl">Lets create a new Blend</h2>
      <div className="flex flex-col gap-4">
        <label className="flex flex-col text-sm">
          What is the name of your blend?
          <input
            {...register('name')}
            className="border border-gray-300 rounded px-3 py-2 mt-1"
            placeholder="Blend Name"
          />
        </label>

        <label className="flex flex-col text-sm">
          Describe your blend
          <textarea
            {...register('description')}
            className="border border-gray-300 rounded px-3 py-2 mt-1"
            rows={4}
            placeholder="Blend description"
          />
        </label>
      </div>

      <div className="relative">
        <div className="absolute right-2 bottom-20 z-10">
          <div className="relative">
            <button
            type='button'
              onClick={() => setShowColorPicker((s) => !s)}
              className="relative cursor-pointer transition z-10 hover:scale-105 shadow-lg bg-teal-500 h-8 w-8 flex items-center justify-center rounded-full "
            >
              <PaintBrushIcon className="w-5 h-5 text-white" />
            </button>
            {showColorPicker && (
              <div className="absolute bottom-2 left-2 z-1 p-2 rounded blend-color-picker">
                <HexColorPicker
                  color={backgroundColor}
                  onChange={setBackgroundColor}
                />
              </div>
            )}
          </div>
        </div>

        <label
          htmlFor="blend-image-upload"
          className=" absolute -left-2 top-10 shadow-lg cursor-pointer transition hover:scale-105 bg-teal-500 h-8 w-8 flex items-center justify-center rounded-full z-10 "
        >
          <PhotoIcon className="w-8 h-8 text-white" />
        </label>
        <input
          id="blend-image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <div className="relative flex">
          <BlendTileCover
            cardClassName="shadow-xl shadow-gray-950/10"
            blend={{
              id: 0,
              image: coverImage ? URL.createObjectURL(coverImage) : undefined,
              heat: 4,
              price: '$$$',
              name: name || 'Blend Title',
              description:
                description ||
                'A description for this new blend that is no longer that 50 charaters',
              color: backgroundColor,
              blend_ids: [],
              spice_ids: [],
            }}
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 bg-teal-600 col-span-2 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
      >
        Create Blend
      </button>
    </form>
  );
};

export default CreateBlendForm;
