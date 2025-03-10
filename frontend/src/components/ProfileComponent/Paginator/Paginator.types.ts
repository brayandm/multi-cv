export interface IPaginatorProps {
  onNewPage: () => void;
  total: number;
  buttonLabel: string;
  children: React.ReactNode;
}
