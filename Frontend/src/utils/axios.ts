import axios, { AxiosRequestConfig } from 'axios';

import { DORRAQ_APP_HOST_API } from 'src/config-global';

const axiosInstance = axios.create({ baseURL: DORRAQ_APP_HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

export const endpoints = {
  auth: {
    me: '/users/me',
    login: '/users/login',
    register: '/users/continue-registration',
  },
};
