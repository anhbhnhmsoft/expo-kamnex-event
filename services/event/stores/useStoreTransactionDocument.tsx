import { create } from 'zustand';

export type TransactionDocumentData = {
    trans_id: string;
    expired_at: string;
    config_pay: {
        name: string;
        bin: string;
        number: string;
    };
    money: string;
    description: string;
};

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
