import { selector, useRecoilValue } from "recoil";
import { sidebar, siteService } from "../atoms/siteAtom";

export const sidebarState = selector({
  key: "sidebarState",
  get: ({ get }) => {
    const getSidebarShow = get(sidebar);
    return { getSidebarShow };
  },
});

export const siteServiceState = selector({
  key: "siteServiceState",
  get: ({ get }) => {
    const getSiteService = get(siteService);
    return { getSiteService };
  },
});
