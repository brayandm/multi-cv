import { RefObject } from "react";

export interface IPaginatorProps {
  onNewPage: () => void;
  onRemovePage: (index: number) => void;
  total: number;
  elementName: string;
  maxElements: number;
  onPageChange?: (page: number) => void;
  children: React.ReactNode;
  formRef: RefObject<HTMLFormElement | null>;
}
