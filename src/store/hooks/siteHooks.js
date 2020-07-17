import { useRecoilState } from "recoil";
import { sidebar } from "../atoms/siteAtom";
import Axios from "axios";
import { config } from "../../core/config";

export const useOpenSidebar = () => {
  const [show, setShow] = useRecoilState(sidebar);
  return () => setShow({ ...show, sidebarShow: !show.sidebar });
};

export const useReqNavs = () => {
  const [side, setSide] = useRecoilState(sidebar);
  return async () => {
    const { data } = await Axios.get(
      `${config.api.url}/dashboards/nav`
    );

    const sides = {
      _tag: "CSidebarNavDropdown",
      name: "Dashboard",
      to: "/d",
      icon: "cil-speedometer",
      _children: [],
    };

    data.map((d) => {
      sides["_children"].push({
        _tag: "CSidebarNavItem",
        name: d.title,
        to: d.url,
      });
    });

    return setSide({ ...sidebar, navs: [sides] });
  };
};
