// store/invoiceStore.ts
import { create } from "zustand";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  creditorName: string;
}

interface InvoiceState {
  items: InvoiceItem[];
  newItem: string;
  newQuantity: number;
  newPrice: number;
  newCreditorName: string;
  addItem: (item: InvoiceItem) => void;
  removeItem: (index: number) => void;
  setNewItem: (item: string) => void;
  setNewQuantity: (quantity: number) => void;
  setNewPrice: (price: number) => void;
  setNewCreditorName: (creditorName: string) => void;
}

const useInvoiceStore = create<InvoiceState>((set) => ({
  items: [],
  newItem: "",
  newQuantity: 1,
  newPrice: 0,
  newCreditorName: "",
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (index) =>
    set((state) => ({
      items: [...state.items.slice(0, index), ...state.items.slice(index + 1)],
    })),
  setNewItem: (item) => set({ newItem: item }),
  setNewQuantity: (quantity) => set({ newQuantity: quantity }),
  setNewPrice: (price) => set({ newPrice: price }),
  setNewCreditorName: (creditorName) => set({ newCreditorName: creditorName }),
}));

export default useInvoiceStore;
