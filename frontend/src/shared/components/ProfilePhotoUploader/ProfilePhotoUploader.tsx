import { useRef, useState } from "react";
import { Input, Spinner } from "@heroui/react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/solid";

export interface IProfilePhotoUploaderProps {
  image: string | null;
  onImageChange?: (file: File) => void;
  onImageRemove?: () => void;
}

const ProfilePhotoUploader = ({
  image,
  onImageChange = () => {},
  onImageRemove = () => {},
}: IProfilePhotoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [onSubmitting, setOnSubmitting] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setOnSubmitting(true);
    const file = e.target.files?.[0];
    if (file) {
      await onImageChange(file);
    }
    setOnSubmitting(false);
  };

  const handleRemoveImage = () => {
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative inline-block">
      <div
        className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image}
            alt="Profile"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : !onSubmitting ? (
          <PlusIcon className="w-8 h-8 text-gray-500" />
        ) : (
          <Spinner />
        )}
      </div>

      {image && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="absolute top-[-0.25rem] right-[-0.25rem] bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}

      <Input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
      />
    </div>
  );
};

export default ProfilePhotoUploader;
