import { patch } from "@mui/material";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/";
const USERS_URL = "users/";
const APPOINTMENT_URL = "appointments/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];

    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(error);
    if (error.response?.status === 401) {
      console.log("bruh");
      localStorage.removeItem("auth-storage");
      window.location.replace("/login");
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  getMe: async () => {
    const response = await axiosInstance.get(`${USERS_URL}me/`);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post(
      `${USERS_URL}login/`,
      credentials,
    );
    return response.data;
  },

  register: async (credentials) => {
    const {
      email,
      accountType,
      firstName,
      lastName,
      password,
      phone,
      username,
      specialization,
    } = credentials;
    const response = await axiosInstance.post(`${USERS_URL}register/`, {
      email,
      username,
      password,
      specialization,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      is_doctor: accountType === "doctor",
      is_patient: accountType === "patient",
    });

    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post(`${USERS_URL}logout/`);

    return response.data;
  },

  updateProfile: async (patchInfo) => {
    const response = await axiosInstance.put(`${USERS_URL}update-profile/`, {
      first_name: patchInfo.firstName,
      last_name: patchInfo.lastName,
      email: patchInfo.email,
      phone_number: patchInfo.phone,
      specialization: patchInfo.specialization,
    });

    return response.data;
  },
};

export const appointmentsApi = {
  createSchedule: async (payload) => {
    const { date, endTime, startTime, duration } = payload;
    const response = await axiosInstance.post(`${APPOINTMENT_URL}schedules/`, {
      duration,
      date,
      doctor: 1,
      end_time: `${endTime}:00`,
      start_time: `${startTime}:00`,
    });

    return response.data;
  },
};
