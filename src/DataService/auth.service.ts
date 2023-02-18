import axios from "../api/axios";

export const publicLogin = async (
  username: string,
  password: string
): Promise<any> => {
  try {
    let raw = await axios.post(`/data-clerk/public-login`, {
      username,
      password,
    });
    let data = raw.data;
    return data as { token: string };
  } catch (error) {
    return error;
  }
};

export const clerkLogin = async (
  username: string,
  password: string,
  token: string
): Promise<any> => {
  try {
    let raw = await axios.post(`/data-clerk/login`, {
      username,
      password,
      token,
    });
    let data = raw.data as { token: string };
    return data;
  } catch (error) {
    return error;
  }
};

export const clerkSignup = async (
  username: string,
  password: string,
  token: string
): Promise<any> => {
  try {
    let raw = await axios.post(`/data-clerk/signup`, {
      username,
      password,
      token,
    });
    let data = raw.data as { token: string };
    return data;
  } catch (error) {
    return error;
  }
};
