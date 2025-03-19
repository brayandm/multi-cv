export type ItemId = "home" | "logout" | "change-password";
export type Item = {
  name: string;
  route: string;
  id: ItemId;
};

export interface ITopBarNavigationProps {
  empty?: boolean;
  onlyLogout?: boolean;
  passwordRoute?: boolean;
  homeRoute?: boolean;
  profileRoute?: boolean;
}
