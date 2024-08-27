import { create } from "zustand";

type EditorContextStore = {
  authenticated: boolean;
  savable: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  setSavable: (savable: boolean) => void;
};

export const useEditorContext = create<EditorContextStore>((set) => ({
  authenticated: false,
  savable: false,
  setAuthenticated: (authenticated: boolean) => set({ authenticated }),
  setSavable: (savable: boolean) => set({ savable }),
}));
