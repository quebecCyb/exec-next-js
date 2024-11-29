import axios from "axios";
import {getSession} from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_SITE_URL + "/api"; 

const ApiClient = () => {
  const defaultOptions = {
    baseURL,
    withCredentials: true,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(`error`, error);
    }
  );

  return instance;
};
export const api = ApiClient()
