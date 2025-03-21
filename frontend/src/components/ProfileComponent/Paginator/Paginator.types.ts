import { RefObject } from "react";

export interface IPaginatorProps {
  onNewPage: () => void;
  onRemovePage: (index: number) => void;
  total: number;
  elementName: string;
  maxElements: number;
  children: React.ReactNode;
  formRef: RefObject<HTMLFormElement | null>;
}
