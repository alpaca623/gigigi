import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { sidebar, sidebarState, useOpenSidebar, useReqNavs } from "../store/";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

// sidebar nav config
import navigation from "./_nav";

const TheSidebar = () => {
  const { sidebarShow, navs } = useRecoilValue(sidebar);
  const toggleSidebar = useOpenSidebar();
  const loadNavs = useReqNavs();

  useEffect(() => {
    loadNavs();
  }, []);
  return (
    <CSidebar minimize={true} show={sidebarShow} onShowChange={toggleSidebar}>
      <CSidebarBrand className="d-md-down-none" to="/">
        <CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          height={35}
        />
        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        />
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={navs}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
