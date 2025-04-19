import { useRef, useState } from "react";
import { Input, Spinner } from "@heroui/react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import imageCompression from "browser-image-compression";

export interface IProfilePhotoUploaderProps {
  image: string | null;
  onImageChange?: (file: File) => void;
  onImageRemove?: () => void;
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const ProfilePhotoUploader = ({
  image,
  onImageChange = () => {},
  onImageRemove = () => {},
}: IProfilePhotoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = useTranslations();

  const [onSubmitting, setOnSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [version, setVersion] = useState<number | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setOnSubmitting(true);
    const file = e.target.files?.[0];

    if (!file) {
      setOnSubmitting(false);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError(t("common.errors.file_size", { max: 10 }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      setOnSubmitting(false);
      return;
    }

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      });

      const smallerFile =
        compressedFile.size < file.size ? compressedFile : file;

      const namedFile = new File([smallerFile], file.name, {
        type: smallerFile.type,
      });

      await onImageChange(namedFile);

      setVersion(Date.now());
    } catch (err) {
      console.error("Compression error:", err);
      setError(t("common.errors.compression"));
      if (fileInputRef.current) fileInputRef.current.value = "";
    }

    setOnSubmitting(false);
  };

  const handleRemoveImage = () => {
    onImageRemove();
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex relative flex-col">
      <div
        className="w-24 h-24 bg-gray-200 dark:bg-default-100 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image ? `${image}?v=${version ?? 0}` : undefined}
            alt="Profile"
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
          className="absolute top-[-0.25rem] right-[-0.25rem] bg-danger text-white rounded-full p-1 hover:bg-danger-300"
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

      {error && (
        <p className="text-danger font-light text-center text-xs mt-2 w-24">
          {error}
        </p>
      )}
    </div>
  );
};

export default ProfilePhotoUploader;
