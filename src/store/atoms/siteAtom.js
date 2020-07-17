import { atom } from "recoil";

export const sidebar = atom({
  key: "sidebar",
  default: {
    sidebarShow: "responsive",
    navs: [],
  },
});

export const siteService = atom({
  key: "siteService",
  default: {
    flagNewDashboard: false,
  },
});
