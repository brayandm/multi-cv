import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Button,
  Spinner,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface IInputModalComponentProps {
  title: string;
  placeholder: string;
  input: string;
  isInputLoading?: boolean;
  setInput: (input: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  maxCharacters: number;
}

export default function InputModalComponent({
  title,
  placeholder,
  input,
  isInputLoading,
  setInput,
  open,
  setOpen,
  onSave,
  onCancel,
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
              {isInputLoading ? (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              ) : (
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholder}
                  maxLength={maxCharacters}
                />
              )}
            </ModalBody>
            <ModalFooter className="flex justify-end gap-2">
              <Button
                variant="light"
                color="danger"
                className="w-32"
                onPress={() => {
                  onCancel();
                  handleClose();
                }}
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
