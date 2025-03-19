"use client";
import React, { useRef, useState } from "react";
import { IPaginatorProps } from "../Paginator/Paginator.types";
import { Button, Pagination } from "@heroui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Paginator: React.FC<IPaginatorProps> = ({
  onNewPage,
  onRemovePage,
  total,
  buttonLabel,
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentpage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(total);

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
    if (currentPage === 1) {
      if (totalPages === 1) {
      } else {
        scrollToPage(currentPage + 1);
      }
    } else {
      scrollToPage(currentPage - 1);
      setCurrentpage(currentPage - 1);
    }
    setTimeout(() => {
      onRemovePage(currentPage - 1);
      setTotalPages(totalPages - 1);
    }, 200);
  }

  return (
    <section className={`flex flex-col`}>
      <Button
        variant="bordered"
        color="danger"
        className="rounded-full self-center"
        isIconOnly
        onPress={deleteCurrentPage}
      >
        <XMarkIcon className="w-5 h-5" />
      </Button>
      <div ref={scrollRef} className="overflow-hidden snap-x snap-mandatory">
        <div ref={childRef} className="flex">
          {children}
        </div>
      </div>

      {totalPages > 0 && (
        <div className="flex justify-center">
          <Pagination
            onChange={(page) => {
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
      <Button
        variant="bordered"
        color="primary"
        onPress={addNewPage}
        type="submit"
        className="mx-1"
      >
        {buttonLabel}
      </Button>
    </section>
  );
};

export default Paginator;
