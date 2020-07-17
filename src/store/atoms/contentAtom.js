import { atom } from "recoil";
import { panelTypes } from "../../assets/datas/panelTypes";

export const content = atom({
  key: "content",
  default: {
    panel: false,
    dialog: false,
    content: [],
  },
});
