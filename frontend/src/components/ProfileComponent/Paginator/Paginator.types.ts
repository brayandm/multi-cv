export interface IPaginatorProps {
  onNewPage: () => void;
  onRemovePage: (index: number) => void;
  total: number;
  elementName: string;
  children: React.ReactNode;
}
