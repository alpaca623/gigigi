import { selector } from "recoil";
import { content } from "../atoms/contentAtom";

export const contentState = selector({
  key: "contentState",
  get: ({ get }) => {
    const getContent = get(content);
    return { getContent };
  },
  set: ({ set }, newValue) => set(content, newValue),
});
