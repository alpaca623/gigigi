import { useRecoilState } from "recoil";
import { content } from "../atoms/contentAtom";
import Axios from "axios";
import { config } from "../../core/config";

const basicContent = {
  dashboard: {
    uid: "empty",
    title: "empty",
    panels: [],
  },
  meta: {},
  uid: "empty",
};

export const useReqDashboard = () => {
  const [item, setItem] = useRecoilState(content);

  return async (uid) => {
    if (!uid) {
      setItem({
        ...item,
        content: basicContent,
        panel: false,
        dialog: false,
      });
    } else {
      try {
        const { data } = await Axios.get(`${config.api.url}/dashboards`, {
          params: { uid },
        });

        // console.log(Object.getOwnPropertyDescriptor(data[0], 'dashboard'));
        setItem({
          ...item,
          content: data.length > 0 ? data[0] : [],
          panel: false,
          dialog: false,
        });
      } catch (error) {
        setItem({
          ...item,
          content: basicContent,
          panel: false,
          dialog: false,
        });
      }
    }
  };
};
