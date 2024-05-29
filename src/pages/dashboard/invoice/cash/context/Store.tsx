import { create } from "zustand";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  description: string;
  discount: number;
  code: string;
}

interface InvoiceState {
  items: InvoiceItem[];
  outsourcedItemIndices: number[];
  newItem: string;
  newQuantity: number;
  newPrice: number;
  newDescription: string;
  newDiscount: number;
  newCode: string;
  addItem: (item: InvoiceItem) => void;
  removeItem: (index: number) => void;
  setNewItem: (item: string) => void;
  setNewQuantity: (quantity: number) => void;
  setNewPrice: (price: number) => void;
  setNewDescription: (description: string) => void;
  setNewDiscount: (discount: number) => void;
  setNewCode: (code: string) => void;
  clearNewItem: () => void;
  toggleItemOutsourced: (index: number) => void;
}

const useInvoiceStore = create<InvoiceState>((set) => ({
  items: [],
  outsourcedItemIndices: [],
  newItem: "",
  newQuantity: 1,
  newPrice: 0,
  newDescription: "",
  newDiscount: 0,
  newCode: "",
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (index) =>
    set((state) => ({
      items: [...state.items.slice(0, index), ...state.items.slice(index + 1)],
    })),
  setNewItem: (item) => set({ newItem: item }),
  setNewQuantity: (quantity) => set({ newQuantity: quantity }),
  setNewPrice: (price) => set({ newPrice: price }),
  setNewDescription: (description) => set({ newDescription: description }),
  setNewDiscount: (discount) => set({ newDiscount: discount }),
  setNewCode: (code) => set({ newCode: code }),
  clearNewItem: () =>
    set({
      newItem: "",
      newQuantity: 1,
      newPrice: 0,
      newDescription: "",
      newDiscount: 0,
      newCode: "",
    }),
  toggleItemOutsourced: (index) =>
    set((state) => ({
      outsourcedItemIndices: state.outsourcedItemIndices.includes(index)
        ? state.outsourcedItemIndices.filter((i) => i !== index)
        : [...state.outsourcedItemIndices, index],
    })),
}));

export default useInvoiceStore;
