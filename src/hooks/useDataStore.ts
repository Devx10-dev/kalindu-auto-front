import { create } from "zustand";
// import axios, { AxiosResponse } from "axios";

interface DataStoreState {
  data: unknown | null;
  loading: boolean;
  error: string | null;
  // fetchData: (url: string) => Promise<void>;
}

const useDataStore = create<DataStoreState>(() => ({
  data: {
    userName: "Tharindu",
  },
  loading: false,
  error: null,

  // fetchData: async (url: string) => {
  //   set({ loading: true, error: null });
  //   try {
  //     const response: AxiosResponse<any> = await axios.get(url);
  //     set({ data: response.data, loading: false });
  //   } catch (error: any) {
  //     set({ error: error.message, loading: false });
  //   }
  // },

}));

export default useDataStore;