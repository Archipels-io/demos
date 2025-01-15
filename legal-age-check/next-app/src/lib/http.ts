import { ACCESS_TOKEN, ARCHIPELS_API_URL, WALLET_DID } from "@/lib/constants";
import axiosModule from "axios";

const axios = axiosModule.create({
  baseURL: ARCHIPELS_API_URL,
  headers: {
    authorization: `Bearer ${ACCESS_TOKEN}`,
    wallet: WALLET_DID,
  },
});

export { axios };
