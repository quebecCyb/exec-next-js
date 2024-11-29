"use server";
import { registerUser } from "@/config/user.config";

import {UserDocument} from "@/app/api/user/data";
export const addUser = async (data: UserDocument) => {
  const response = await registerUser(data);
  return response;
};
