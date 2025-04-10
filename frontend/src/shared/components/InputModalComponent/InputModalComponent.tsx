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

interface IInputModalComponentProps {
  title: string;
  placeholder: string;
  input: string;
  setInput: (input: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  maxCharacters: number;
}

export default function InputModalComponent({
  title,
  placeholder,
  input,
  setInput,
  open,
  setOpen,
  maxCharacters,
}: IInputModalComponentProps) {
  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const t = useTranslations();

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
              <Button variant="light" onPress={handleClose}>
                {t("common.buttons.cancel")}
              </Button>
              <Button color="primary" onPress={handleClose}>
                {t("common.buttons.save")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
