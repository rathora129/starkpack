'use client';

import { create } from 'zustand';

let toastCounter = 0;

export const useUiStore = create((set) => ({
  commandOpen: false,
  mobileNavOpen: false,
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  toasts: [],
  pushToast: (toast) => {
    toastCounter += 1;
    const id = `toast-${Date.now()}-${toastCounter}`;
    set((state) => ({
      toasts: [...state.toasts, { id, tone: 'success', ...toast }],
    }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }));
    }, 5200);
    return id;
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
}));

export function notify(title, message = '', tone = 'success') {
  useUiStore.getState().pushToast({ title, message, tone });
}
