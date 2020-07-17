import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import ReactGridLayout from "react-grid-layout";

import {
  Icon,
  Popover,
  Menu,
  MenuItem,
  Position,
  Dialog,
  Classes,
  Tree,
  Button,
  InputGroup,
  Label,
} from "@blueprintjs/core";

import { CCard, CCardBody, CCardHeader } from "@coreui/react";
import sizeMe from "react-sizeme";
import classNames from "classnames";

import { lgedgeinfo } from "../../assets/datas/lgedgeinfo";
import { panelTypes } from "../../assets/datas/panelTypes";
import { content, useReqDashboard } from "../../store";
import { siteService } from "../../store/atoms/siteAtom";

let lastGridWidth = 1200;
let ignoreNextWidthChange = false;

function GridWrapper({
  size,
  isDraggable,
  layout,
  isResizable,
  children,
  onDragStop,
  onResizeStop,
}) {
  const width = size.width > 0 ? size.width : lastGridWidth;

  if (width !== lastGridWidth) {
    if (ignoreNextWidthChange) {
      ignoreNextWidthChange = false;
    } else if (!null && Math.abs(width - lastGridWidth) > 8) {
      lastGridWidth = width;
    }
  }
  const draggable = width <= 420 ? false : isDraggable;

  return (
    <ReactGridLayout
      width={lastGridWidth}
      isDraggable={draggable}
      isResizable={isResizable}
      cols={24}
      rowHeight={47}
      margin={[8, 8]}
      containerPadding={[0, 0]}
      layout={layout}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      // draggableHandle=".grid-drag-handle"
    >
      {children}
    </ReactGridLayout>
  );
}

const SizedReactLayoutGrid = sizeMe({ monitorWidth: true })(GridWrapper);

const Layout = (props) => {
  // const panelRef = {};
  const panelMap = {};

  const reqDashboard = useReqDashboard();
  const [item, setItem] = useRecoilState(content);
  const [panelItems, setPanelItems] = useState(panelTypes);
  const [selectItem, setSelectItem] = useState("");

  const [newPanel, setNewPanel] = useState({});

  const [tempPanel, setTempPanel] = useState({
    title: "",
  });
  // console.log(Object.getOwnPropertyDescriptor(item, "content"));
  const { uid } = props.match.params;
  useEffect(() => {
    if (uid === "new") {
      const newDashboard = {
        uid: "new",
        dashboard: {
          title: "new dashboard",
          panels: [
            {
              id: 1,
              collapsed: true,
              gridPos: {
                h: 6,
                w: 12,
                x: 0,
                y: 0,
              },
              title: "New Panel",
              type: "add-panel",
            },
          ],
        },
      };
      setItem({ ...item, content: newDashboard, dialog: false, panel: false });
      return;
    }
    reqDashboard(uid);
  }, [uid]);

  const buildLayout = () => {
    const layout = [];
    try {
      if (!Array.isArray(item.content)) {
        for (const panel of item.content.dashboard.panels) {
          const stringId = panel.id.toString();
          panelMap[stringId] = panel;

          if (!panel.gridPos) {
            console.log("panel without gridPos");
            continue;
          }

          const panelPos = {
            i: stringId,
            x: panel.gridPos.x,
            y: panel.gridPos.y,
            w: panel.gridPos.w,
            h: panel.gridPos.h,
          };

          if (panel.type === "row") {
            panelPos.w = 24;
            panelPos.h = 1;
            panelPos.isResizable = false;
            panelPos.isDraggable = panel.collapsed;
          }

          layout.push(panelPos);
        }
      }
    } catch (error) {
      console.error("er", error);
    }
    return layout;
  };

  // const otherPanelInFullscreen = (panel) => {
  //   return false;
  // };

  const deletePanel = (panel) => {
    const newPanels = item.content.dashboard.panels.filter(
      (p) => p.id !== panel.id
    );
    setItem({
      ...item,
      content: {
        ...item.content,
        dashboard: {
          ...item.content.dashboard,
          panels: newPanels,
        },
      },
      panel: false,
    });
  };

  const updatePanel = (panel) => {
    setNewPanel(panel);
    setItem({
      ...item,
      dialog: true,
    });
    setTempPanel({
      ...tempPanel,
      title: panel.title,
    });
  };

  useEffect(() => {
    if (item.panel) {
      addPanel();
    }
  }, [item.panel]);

  const addPanel = () => {
    const arrangePanels = item.content.dashboard.panels.map((p) => {
      return {
        ...p,
        gridPos: {
          ...p.gridPos,
          y: p.gridPos.y + 6,
        },
      };
    });
    const newPanel = {
      id: item.content.dashboard.panels.length + 100,
      // title: "New Panel",
      type: "add-panel",
      gridPos: {
        h: 6,
        w: 12,
        x: 0,
        y: 0,
      },
    };
    // setTempPanel(newPanel);
    setItem({
      ...item,
      content: {
        ...item.content,
        dashboard: {
          ...item.content.dashboard,
          panels: [...arrangePanels, newPanel],
        },
      },
    });

    setTempPanel({
      ...tempPanel,
      title: newPanel.title,
    });
  };

  const closeAddPanelDialog = () => {
    setItem({
      ...item,
      dialog: false,
    });
  };

  const panelMenu = (panel) => {
    return (
      <Menu>
        <MenuItem text="수정" onClick={(e) => updatePanel(panel)} />
        <MenuItem text="삭제" onClick={(e) => deletePanel(panel)} />
      </Menu>
    );
  };

  const renderPanels = () => {
    const panelElements = [];
    if (!Array.isArray(item.content)) {
      for (const panel of item.content.dashboard.panels) {
        panelElements.push(renderPanel(panel));
      }
    }
    return panelElements;
  };

  const renderPanel = (panel) => {
    // console.log(panel);
    if (panel.type === "row") {
      return (
        <CCard key={panel.id.toString()}>
          <CCardHeader>
            {panel.title}
            <Icon
              icon="trash"
              iconSize={12}
              onClick={() => deletePanel(panel)}
              style={{ cursor: "pointer" }}
            />
          </CCardHeader>
        </CCard>
      );
    }

    if (panel.type === "add-panel") {
      return (
        <CCard key={panel.id.toString()}>
          <CCardHeader style={{ textAlign: "center" }}>
            New Panel
            <Icon
              icon="small-cross"
              onClick={() => deletePanel(panel)}
              style={{ cursor: "pointer" }}
            />
          </CCardHeader>
          <CCardBody>
            <Button onClick={(e) => setupNewpanel(e, panel)}>New Panel</Button>
          </CCardBody>
        </CCard>
      );
    }

    return (
      <CCard key={panel.id.toString()}>
        <CCardHeader style={{ textAlign: "center" }}>
          {panel.title}
          <Popover content={panelMenu(panel)} position={Position.BOTTOM}>
            <Icon icon="caret-down" style={{ cursor: "pointer" }} />
          </Popover>
        </CCardHeader>
        <CCardBody>{panel.type}</CCardBody>
      </CCard>
    );
  };

  const forEachNode = (nodes, callback) => {
    if (nodes == null) {
      return;
    }
    for (const node of nodes) {
      callback(node);
      forEachNode(node.childNodes, callback);
    }
  };

  const handleTreeClick = (nodeData, nodePath, e) => {
    setSelectItem(nodeData);
    const originallySelected = nodeData.isSelected;
    if (!e.shiftKey) {
      forEachNode(panelItems, (n) => (n.isSelected = false));
    }
    nodeData.isSelected =
      originallySelected == null ? true : !originallySelected;
    setPanelItems([...panelItems]);
  };

  // open new panel dialog
  const setupNewpanel = (e, panel) => {
    setNewPanel(panel);
    e.stopPropagation();
    setItem({
      ...item,
      dialog: true,
    });
    // console.log("panelMap check", panelMap);
  };

  // new panel save check
  const confirmNewPanel = (e) => {
    if (selectItem.hasCaret || selectItem === "") {
      alert("세부 항목을 눌러주세요");
      return;
    }
    const tempPanels = [...item.content.dashboard.panels];
    // console.log(tempPanel, item.content.dashboard.panels);
    // console.log(selectItem);
    const t = tempPanels.map((p, i) => {
      const panel = { ...p };
      if (p.id === newPanel.id) {
        panel.type = selectItem.data;
        panel.title = tempPanel.title;
      }
      return panel;
    });
    setItem({
      ...item,
      content: {
        ...item.content,
        dashboard: {
          ...item.content.dashboard,
          panels: [...t],
        },
      },
      dialog: false,
      panel: false,
    });
    // tree 초기화
    setTempPanel({
      ...tempPanel,
      title: "",
    });
    forEachNode(panelItems, (n) => (n.isSelected = false));
    // window.location.reload(true);
  };

  const handleNodeCollapse = (nodeData) => {
    const newTree = panelItems.map((t) => {
      if (t.id === nodeData.id) {
        t.isExpanded = false;
      }
      return t;
    });
    // console.log(newTree);
    setPanelItems([...newTree]);
  };
  const handleNodeExpand = (nodeData) => {
    const newTree = panelItems.map((t) => {
      if (t.id === nodeData.id) {
        t.isExpanded = true;
      }
      return t;
    });
    // console.log(newTree);
    setPanelItems([...newTree]);
  };

  const panelList = () => (
    <Tree
      // className={Classes.ELEVATION_0}
      contents={panelTypes}
      onNodeCollapse={handleNodeCollapse}
      onNodeExpand={handleNodeExpand}
      onNodeClick={handleTreeClick}
    />
  );

  const onDragStop = (layout, oldItem, newItem) => {
    // console.log("old..", item.content.dashboard.panels);
    const oldPanels = [...item.content.dashboard.panels];
    const newPanels = oldPanels.map((old, i) => {
      const item = {
        ...old,
        gridPos: {
          x: layout[i].x,
          y: layout[i].y,
          w: layout[i].w,
          h: layout[i].h,
        },
      };
      return item;
    });
    setItem({
      ...item,
      content: {
        ...item.content,
        dashboard: {
          ...item.content.dashboard,
          panels: [...newPanels],
        },
      },
    });
  };
  const onResizeStop = (layout, oldItem, newItem) => {
    const oldPanels = [...item.content.dashboard.panels];
    const newPanels = oldPanels.map((old, i) => {
      const item = {
        ...old,
        gridPos: {
          x: layout[i].x,
          y: layout[i].y,
          w: layout[i].w,
          h: layout[i].h,
        },
      };
      return item;
    });
    setItem({
      ...item,
      content: {
        ...item.content,
        dashboard: {
          ...item.content.dashboard,
          panels: [...newPanels],
        },
      },
    });
  };

  return (
    <>
      <SizedReactLayoutGrid
        layout={buildLayout()}
        className={classNames({ layout: true })}
        isResizable={lgedgeinfo.meta.canEdit}
        isDraggable={lgedgeinfo.meta.canEdit}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
      >
        {renderPanels()}
      </SizedReactLayoutGrid>
      <Dialog isOpen={item.dialog} onClose={closeAddPanelDialog}>
        <div className={Classes.DIALOG_BODY}>
          <InputGroup
            placeholder="Panel name"
            onChange={(e) =>
              setTempPanel({ ...tempPanel, title: e.target.value })
            }
            value={tempPanel.title}
          />
          <div style={{ width: 280, height: 300 }}>{panelList()}</div>
          {/* <div style={{ display: "flex" }}>
            <div style={{ marginLeft: 20 }}>sampl</div>
          </div> */}
          <div>
            <Button onClick={confirmNewPanel}>생성</Button>
            <Button onClick={closeAddPanelDialog}>취소</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Layout;
