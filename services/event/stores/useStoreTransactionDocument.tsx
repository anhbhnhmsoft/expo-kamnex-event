import { create } from 'zustand';
import {RegisterDocumentResponse} from "@/services/event/types";

export type TransactionDocumentData = RegisterDocumentResponse['data'];

type StoreTransactionDocument = {
    trans: TransactionDocumentData | null;
    setTrans: (trans: TransactionDocumentData | null) => void;
    clearTrans: () => void;
};

export const useStoreTransactionDocument = create<StoreTransactionDocument>((set) => ({
    trans: null,
    setTrans: (trans) => set({ trans }),
    clearTrans: () => set({ trans: null }),
}));
