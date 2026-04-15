import type { StateStorage } from "zustand/middleware";

import { appStorage } from "./appStorage";

export const sessionStorage: StateStorage = {
  getItem: (name) => appStorage.getItem(name),
  setItem: (name, value) => appStorage.setItem(name, value),
  removeItem: (name) => appStorage.removeItem(name)
};


