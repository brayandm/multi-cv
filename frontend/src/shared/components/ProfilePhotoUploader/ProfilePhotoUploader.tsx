import { useRef } from "react";
import { Input } from "@heroui/react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export interface IProfilePhotoUploaderProps {
  image: string | null;
  onImageChange?: (imageDataUrl: string, file: File) => void;
  onImageRemove?: () => void;
}

const ProfilePhotoUploader = ({
  image,
  onImageChange = () => {},
  onImageRemove = () => {},
}: IProfilePhotoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          onImageChange(result, file);
        }
      };
      reader.readAsDataURL(file);
    }
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
          <Image
            src={image}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <PlusIcon className="w-8 h-8 text-gray-500" />
        )}
      </div>

      {image && (
        <button
          onClick={handleRemoveImage}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
