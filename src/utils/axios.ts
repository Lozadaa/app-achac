import axios from "axios";
import { getUser } from "./userUtils";

const BASE_URL = 'https://api.airtraningcenter.com';

export const axiosStandalone = axios.create({
  baseURL: BASE_URL,
});

export const axiosClient = axios.create({
  baseURL: BASE_URL,
});

// interceptor to add token to request
axiosClient.interceptors.request.use(async (config) => {
  const user = await getUser();

  if (!!user) {
    config.headers.Authorization = user.token;
  }

  return config;
});