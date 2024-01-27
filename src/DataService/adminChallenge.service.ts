// POST:   /admin-challenge/create

import axios from "../api/axios";

export const createAdminChallenge = async (adminChallengeDto: any) => {
  const result = await axios.post("/admin-challenge/create", adminChallengeDto);
  const data = result.data;
  return data;
};

export const getAdminChallenge = async (query: {
  startDate?: string;
  endDate?: string;
  level?: number;
  page?: number;
  size?: number;
  isActive?: boolean;
}) => {
  let queryBuilder = "?";
  const page = `${query.page ? query.page : 1}`;
  const size = `${query.size ? query.size : 10}`;
  const queryArray = [];

  if (query.endDate && query.startDate) {
    queryBuilder += `startDate=${query.startDate}&endDate=${query.endDate}&`;
  }

  if (query.level) {
    queryBuilder += `level=${query.level}&`;
  }

  if (query.isActive !== null && query.isActive !== undefined) {
    queryBuilder += `isActive=${query.isActive}`;
  }

  const result = await axios.get("/admin-challenge" + queryBuilder);
  const data = result.data;
  const adminChallenges = data.data as AdminChallenge[];
  const total = data.total;
  return { data: adminChallenges, total };
};

export type AdminChallenge = {
  _id: string;
  numberOfQuestions: number;
  isActive: boolean;
  label: string;
  level: number;
  startDate: string;
  endDate: string;
  createdAt: string;
};
