export type ItemId = "home" | "logout" | "change-password";
export type Item = {
  name: string;
  route: string;
  id: ItemId;
};

export interface ITopBarNavigationProps {
  passwordLink?: boolean;
  homeLink?: boolean;
  logoutLink?: boolean;
  profileLink?: boolean;
}
