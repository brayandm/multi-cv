"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IPaginatorProps } from "../Paginator/Paginator.types";
import {
  Button,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  addToast,
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { DEFAULT_CARD_MAX_WIDTH, DEFAULT_CARD_WIDTH } from "@/lib/consts";
import { useWindowSize } from "@/hooks/useWindowSize";

const Paginator: React.FC<IPaginatorProps> = ({
  onNewPage,
  onRemovePage,
  total,
  elementName,
  onPageChange = () => {},
  maxElements,
  formRef,
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentpage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(total);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenDiscard,
    // onOpen: onOpenDiscard,
    onOpenChange: onOpenChangeDiscard,
  } = useDisclosure();

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage]); // eslint-disable-line

  const [currentPageBasedOnScroll, setCurrentPageBasedOnScroll] = useState(1);
  const scrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const { width } = useWindowSize();

  const handleScroll = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrolling.current = true;

    scrollTimeout.current = setTimeout(() => {
      const scrollLeft = scrollRef.current?.scrollLeft;
      if (scrollLeft === undefined) return;

      const getWidth = () => {
        const vwValue = width * (DEFAULT_CARD_MAX_WIDTH / 100);
        const minValue = Math.min(vwValue, DEFAULT_CARD_WIDTH);
        return minValue - 32;
      };

      const position = (scrollLeft - 4) / getWidth();
      const page = Math.round(position) + 1;

      setCurrentPageBasedOnScroll(page);
      scrolling.current = false;
    }, 200);
  }, [width]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    scrollElement.addEventListener("scroll", handleScroll);
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    setCurrentpage(currentPageBasedOnScroll);
  }, [currentPageBasedOnScroll]);

  const t = useTranslations();

  const scrollToPage = (page: number) => {
    if (!childRef.current) return;
    const children = childRef.current.children;
    const targetChild = children[page - 1] as HTMLElement;
    if (targetChild) {
      targetChild.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  };
  function addNewPage() {
    onNewPage();

    setTotalPages(totalPages + 1);
    setTimeout(() => {
      scrollToPage(totalPages + 1);
      setCurrentpage(totalPages + 1);
    }, 200);
  }

  function deleteCurrentPage() {
    if (currentPage !== 1) {
      scrollToPage(currentPage - 1);
      setTotalPages(totalPages - 1);
      setTimeout(() => {
        onRemovePage(currentPage - 1);
      }, 1000);
    } else {
      setTotalPages(totalPages - 1);
      onRemovePage(currentPage - 1);
    }
  }

  const [forceUpdate, setForceUpdate] = useState(0);

  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    if (showPopover) {
      setTimeout(() => {
        setShowPopover(false);
      }, 3000);
    }
  }, [showPopover]);

  const content = (
    <PopoverContent>
      <div className="px-1 py-2">
        <div className="text-small font-bold">
          {t("common.texts.unfinished_element", {
            element: elementName,
          })}
        </div>
        <div className="text-tiny">
          {" "}
          {t("common.texts.unfinished_element_description", {
            element: elementName,
          })}
        </div>
      </div>
    </PopoverContent>
  );

  return (
    <section className={`flex flex-col`}>
      <div ref={scrollRef} className="overflow-hidden snap-x snap-mandatory">
        <div ref={childRef} className="flex">
          {children}
        </div>
      </div>

      {totalPages > 0 && (
        <div className="flex justify-center">
          <Pagination
            key={forceUpdate}
            onChange={(page) => {
              if (!formRef.current || !formRef.current.reportValidity()) {
                // onOpenDiscard();
                setForceUpdate((prev) => prev + 1);
                return;
              }
              scrollToPage(page);
              setCurrentpage(page);
            }}
            className="mb-2"
            size="sm"
            isCompact
            showControls
            initialPage={1}
            page={currentPage}
            total={totalPages}
          />
        </div>
      )}
      <div className="flex flex-row gap-1">
        <Popover
          color={"danger"}
          placement="top-start"
          showArrow
          isOpen={showPopover}
          onOpenChange={() => {
            if (!formRef.current || !formRef.current.reportValidity()) {
              setShowPopover(true);
              return;
            }

            if (totalPages >= maxElements) {
              addToast({
                title: t("common.errors.max_elements", {
                  element: elementName,
                }),
                description: t("common.errors.max_elements_description", {
                  element: elementName,
                  max: maxElements,
                }),
                color: "warning",
                timeout: 5000,
              });
              return;
            }
            addNewPage();
          }}
        >
          <PopoverTrigger>
            <Button variant="bordered" color="primary" className="w-full">
              {t("common.buttons.add_element", { element: elementName })}
            </Button>
          </PopoverTrigger>
          {showPopover && content}
        </Popover>
        {totalPages > 0 && (
          <>
            <Button variant="bordered" color="danger" onPress={onOpen}>
              {t("common.buttons.delete")}
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      <h3>
                        {t("common.texts.delete", { element: elementName })}
                      </h3>
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        {t("common.texts.delete_confirmation", {
                          element: elementName,
                        })}
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" variant="light" onPress={onClose}>
                        {t("common.buttons.cancel")}
                      </Button>
                      <Button
                        color="danger"
                        onPress={() => {
                          deleteCurrentPage();
                          onClose();
                        }}
                      >
                        {t("common.buttons.delete")}
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
            <Modal isOpen={isOpenDiscard} onOpenChange={onOpenChangeDiscard}>
              <ModalContent>
                {(onCloseDiscard) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      <h3>
                        {t("common.texts.havent_finished", {
                          element: elementName,
                        })}
                      </h3>
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        {t("common.texts.discard_changes", {
                          element: elementName,
                        })}
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="danger"
                        onPress={() => {
                          deleteCurrentPage();
                          onCloseDiscard();
                        }}
                      >
                        {t("common.buttons.discard")}
                      </Button>
                      <Button
                        color="primary"
                        variant="light"
                        onPress={() => {
                          onCloseDiscard();
                        }}
                      >
                        {t("common.buttons.keep_editing")}
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        )}
      </div>
    </section>
  );
};

export default Paginator;
