import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Button,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface IInputModalComponentProps {
  title: string;
  placeholder: string;
  input: string;
  setInput: (input: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: () => void;
  maxCharacters: number;
}

export default function InputModalComponent({
  title,
  placeholder,
  input,
  setInput,
  open,
  setOpen,
  onSave,
  maxCharacters,
}: IInputModalComponentProps) {
  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const t = useTranslations();

  const [onSaving, setOnSaving] = useState(false);

  return (
    <Modal
      isOpen={open}
      onOpenChange={onOpenChange}
      hideCloseButton
      isDismissable={false}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="text-center">{title}</ModalHeader>
            <ModalBody>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                maxLength={maxCharacters}
              />
            </ModalBody>
            <ModalFooter className="flex justify-end gap-2">
              <Button
                variant="light"
                color="danger"
                className="w-32"
                onPress={handleClose}
                isDisabled={onSaving}
              >
                {t("common.buttons.cancel")}
              </Button>
              <Button
                color="primary"
                className="w-32"
                onPress={async () => {
                  setOnSaving(true);
                  await onSave();
                  setOnSaving(false);
                  handleClose();
                }}
                isLoading={onSaving}
              >
                {t("common.buttons.save")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
