'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { demoRoleById } from '@/lib/nav';

export const useAuthStore = create(
  persist(
    (set) => ({
      session: null,
      signIn: (roleId) => {
        const role = demoRoleById(roleId);
        set({
          session: {
            role: role.id,
            label: role.label,
            person: role.person,
            email: role.email,
            signedInAt: new Date().toISOString(),
          },
        });
        return role;
      },
      signOut: () => set({ session: null }),
    }),
    {
      name: 'stark-packmate:workspace-session',
      storage: createJSONStorage(() =>
        typeof window === 'undefined'
          ? { getItem: () => null, setItem: () => {}, removeItem: () => {} }
          : window.sessionStorage
      ),
      partialize: (state) => ({ session: state.session }),
    }
  )
);
