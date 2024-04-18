import axios, { AxiosInstance } from "axios";
const BASE_URL = import.meta.env.VITE_BE_API_URL;

/**
 * used to send public requests those are not required authentication
 */
export default axios.create({
  baseURL: BASE_URL,
});

class Service {
  protected api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }
}

export { Service };
