import React, { useState } from "react";
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

// routes config
import routes from "../routes";

import {
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  TheHeaderDropdownTasks,
} from "./index";
import { useRecoilState } from "recoil";
import { sidebar, content } from "../store/";
import { Button, Dialog, Classes, Intent, InputGroup } from "@blueprintjs/core";
// import { siteService } from "../store/atoms/siteAtom";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import { config } from "../core/config";

const TheHeader = (props) => {
  const [show, setShow] = useRecoilState(sidebar);
  const [item, setItem] = useRecoilState(content);
  // const [site, setSite] = useRecoilState(siteService);

  const [saveDash, setSaveDash] = useState({
    title: "",
    dialog: false,
  });

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(show.sidebarShow)
      ? false
      : "responsive";
    setShow({ sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(show.sidebarShow)
      ? true
      : "responsive";
    setShow({ sidebarShow: val });
  };

  const addPanelDialog = () => {
    setItem({
      ...item,
      panel: true,
    });
  };

  const openNewDashboard = () => {
    props.history.push("/d/new");
  };

  const openNewDashboardPop = () => {
    setSaveDash({
      ...saveDash,
      dialog: true,
      title: item.content.dashboard.title,
    });
  };

  const saveNewDashboard = async () => {
    const { data } = await Axios.post(`${config.api.url}/dashboards/save`, {
      item: item.content,
      title: saveDash.title === "" ? "New Dashboard" : saveDash.title,
    });
    setSaveDash({
      ...saveDash,
      dialog: false,
      title: "",
    });
    // console.log(data);
    window.location.href = `/d/${data[0].uid}`;
    // window.location.reload(`/d/${data}`);
  };

  return (
    <>
      <CHeader withSubheader>
        <CToggler
          inHeader
          className="ml-md-3 d-lg-none"
          onClick={toggleSidebarMobile}
        />
        <CToggler
          inHeader
          className="ml-3 d-md-down-none"
          onClick={toggleSidebar}
        />
        <CHeaderBrand className="mx-auto d-lg-none" to="/">
          <CIcon name="logo" height="48" alt="Logo" />
        </CHeaderBrand>

        <CHeaderNav className="d-md-down-none mr-auto">
          <CHeaderNavItem className="px-3">
            <CHeaderNavLink to="/dashboard">Dashboard</CHeaderNavLink>
          </CHeaderNavItem>
          <CHeaderNavItem className="px-3">
            <CHeaderNavLink to="/users">Users</CHeaderNavLink>
          </CHeaderNavItem>
          <CHeaderNavItem className="px-3">
            <CHeaderNavLink>Settings</CHeaderNavLink>
          </CHeaderNavItem>
        </CHeaderNav>

        <CHeaderNav className="px-3">
          <TheHeaderDropdownNotif />
          <TheHeaderDropdownTasks />
          <TheHeaderDropdownMssg />
          <TheHeaderDropdown />
        </CHeaderNav>

        <CSubheader className="px-3 justify-content-between">
          <CBreadcrumbRouter
            className="border-0 c-subheader-nav m-0 px-0 px-md-3"
            routes={routes}
          />
          <div className="d-md-down-none mfe-2 c-subheader-nav">
            <Button
              icon="floppy-disk"
              style={{ marginRight: 5 }}
              onClick={openNewDashboardPop}
            />
            <Button
              icon="dashboard"
              style={{ marginRight: 5 }}
              onClick={openNewDashboard}
            >
              New
            </Button>
            <Button
              icon="series-add"
              style={{ marginRight: 5 }}
              onClick={addPanelDialog}
            />
            <Button icon="calendar" style={{ marginRight: 5 }}>
              Today
            </Button>
          </div>
        </CSubheader>
      </CHeader>
      <Dialog
        isOpen={saveDash.dialog}
        onClose={() => setSaveDash({ ...saveDash, dialog: false })}
      >
        <div className={Classes.DIALOG_HEADER}>Dashboard 저장</div>
        <div className={Classes.DIALOG_BODY}>
          <InputGroup
            placeholder="Dashboard Title"
            onChange={(e) =>
              setSaveDash({ ...saveDash, title: e.target.value })
            }
            value={saveDash.title}
          />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <Button intent={Intent.PRIMARY} onClick={saveNewDashboard}>
            저장
          </Button>
          <Button onClick={() => setSaveDash({ ...saveDash, dialog: false })}>
            취소
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default withRouter(TheHeader);
