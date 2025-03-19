export interface IPaginatorProps {
  onNewPage: () => void;
  onRemovePage: (index: number) => void;
  total: number;
  buttonLabel: string;
  children: React.ReactNode;
}
