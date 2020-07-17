import dotenv from "dotenv";

dotenv.config();

export const config = {
  api: {
    url: process.env.REACT_APP_API_URL,
  },
};
