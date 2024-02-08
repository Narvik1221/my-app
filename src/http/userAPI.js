import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password,name, surname, role, ) => {
  const { data } = await $host.post("api/user/registration", {
    email,
    password,
    name,
    surname,
    role,
    
  });
  console.log(data);
  localStorage.setItem("token", data.token);
  return { token: jwtDecode(data.token), userData: data.user };
};

export const login = async (email, password) => {
  const { data } = await $host.post("api/user/login", { email, password });

  localStorage.setItem("token", data.token);
  return { token: jwtDecode(data.token), userData: data.user };
};

export const check = async () => {
  const { data } = await $authHost.get("api/user/auth");
  localStorage.setItem("token", data.token);
  return { token: jwtDecode(data.token), userData: data.user };
};
export const getUser = async () => {
  const { data } = await $host.get("api/user/");
  return { data};
};
export const blockUser= async (id,blocked) => {
  const { data } = await $authHost.put("api/user/block", { id,blocked });
  localStorage.setItem("token", data.token);
  return {  data};
};