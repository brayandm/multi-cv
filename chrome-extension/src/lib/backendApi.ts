import { hostLink } from "@/utils/links";
import axios from "axios";

interface BackendResponse {
  data?: any;
  headers?: any;
  error?: string;
  status: number;
}

export const post = async (
  url: string,
  data: any,
  headers: any = {}
): Promise<BackendResponse> => {
  try {
    const res = await axios.post(hostLink + "/api/backend", {
      url,
      data,
      headers,
      method: "POST",
      nextauth: false,
    });

    return {
      data: res.data,
      headers: res.headers,
      status: res.status,
    };
  } catch (error: any) {
    console.error(error);
    return {
      error:
        error.response?.status != 500
          ? error.response?.data.error
          : "Internal Server Error",
      status: error.response?.status || 500,
    };
  }
};

export const put = async (
  url: string,
  data: any,
  headers: any = {}
): Promise<BackendResponse> => {
  try {
    const res = await axios.post(hostLink + "/api/backend", {
      url,
      data,
      headers,
      method: "PUT",
      nextauth: false,
    });

    return {
      data: res.data,
      headers: res.headers,
      status: res.status,
    };
  } catch (error: any) {
    console.error(error);
    return {
      error:
        error.response?.status != 500
          ? error.response?.data.error
          : "Internal Server Error",
      status: error.response?.status || 500,
    };
  }
};

export const del = async (
  url: string,
  headers: any = {}
): Promise<BackendResponse> => {
  try {
    const res = await axios.post(hostLink + "/api/backend", {
      url,
      headers,
      method: "DELETE",
      nextauth: false,
    });

    return {
      data: res.data,
      headers: res.headers,
      status: res.status,
    };
  } catch (error: any) {
    console.error(error);
    return {
      error:
        error.response?.status != 500
          ? error.response?.data.error
          : "Internal Server Error",
      status: error.response?.status || 500,
    };
  }
};

export const get = async (
  url: string,
  headers: any = {}
): Promise<BackendResponse> => {
  try {
    const res = await axios.post(hostLink + "/api/backend", {
      url,
      headers,
      method: "GET",
      nextauth: false,
    });

    return {
      data: res.data,
      headers: res.headers,
      status: res.status,
    };
  } catch (error: any) {
    console.error(error);
    return {
      error:
        error.response?.status != 500
          ? error.response?.data.error
          : "Internal Server Error",
      status: error.response?.status || 500,
    };
  }
};

export const download = async (
  url: string,
  headers: any = {}
): Promise<BackendResponse> => {
  try {
    const res = await axios.post(
      hostLink + "/api/backend",
      {
        url,
        headers,
        method: "DOWNLOAD",
        nextauth: false,
      },
      {
        responseType: "arraybuffer",
      }
    );

    return {
      data: res.data,
      headers: res.headers,
      status: res.status,
    };
  } catch (error: any) {
    console.error(error);
    return {
      error:
        error.response?.status != 500
          ? error.response?.data.error
          : "Internal Server Error",
      status: error.response?.status || 500,
    };
  }
};
