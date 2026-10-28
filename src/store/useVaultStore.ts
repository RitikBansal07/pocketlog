import { create } from 'zustand';
import { ThemeMode } from '../types/domain';

interface VaultStoreState {
  isLocked: boolean;
  themeMode: ThemeMode;
  isBackgroundObfuscated: boolean;
  hasInitializedVault: boolean;
  unlock: () => void;
  lock: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setObfuscated: (obfuscated: boolean) => void;
  setInitialized: () => void;
}

export const useVaultStore = create<VaultStoreState>((set) => ({
  isLocked: false,
  themeMode: 'dark',
  isBackgroundObfuscated: false,
  hasInitializedVault: false,

  unlock: () => set({ isLocked: false }),
  lock: () => set({ isLocked: true }),
  setThemeMode: (mode) => set({ themeMode: mode }),
  setObfuscated: (obfuscated) => set({ isBackgroundObfuscated: obfuscated }),
  setInitialized: () => set({ hasInitializedVault: true }),
}));

