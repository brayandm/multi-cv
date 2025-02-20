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
  headers: any = {},
): Promise<BackendResponse> => {
  try {
    const res = await axios.post("/api/backend", {
      url,
      data,
      headers,
      method: "POST",
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
  headers: any = {},
): Promise<BackendResponse> => {
  try {
    const res = await axios.post("/api/backend", {
      url,
      data,
      headers,
      method: "PUT",
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
  headers: any = {},
): Promise<BackendResponse> => {
  try {
    const res = await axios.post("/api/backend", {
      url,
      headers,
      method: "DELETE",
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
  headers: any = {},
): Promise<BackendResponse> => {
  try {
    const res = await axios.post("/api/backend", {
      url,
      headers,
      method: "GET",
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
  headers: any = {},
): Promise<BackendResponse> => {
  try {
    const res = await axios.post(
      "/api/backend",
      {
        url,
        headers,
        method: "DOWNLOAD",
      },
      {
        responseType: "arraybuffer",
      },
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
