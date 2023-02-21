import axios from "../api/axios";
import { Clerk } from "../models/clerks.model";

type ClerksAndDataSystemInfo = { clerks: Clerk[] } & { totalData: number };

export const getClerkInfoFromServer = async () => {
  const result = await axios.get("/data-clerk");
  const data = result.data as {
    username: string;
    balance: number;
    questionsEntered: number;
  };
  return data;
};

export const getClerksAndDataInfoFromServer = async () => {
  const result = await axios.get("/data-clerk/system-info");
  const data = result.data as ClerksAndDataSystemInfo;
  return data;
};
