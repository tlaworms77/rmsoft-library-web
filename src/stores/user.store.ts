import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserStore {
  user: any;
  setUser: (user: any) => void;
  removeUser: () => void;
}

const userStore = create(
  persist<UserStore>(
    (set) => ({
      user: null,
      setUser: (user: any) => {
        set((state) => ({ ...state, user }));
      },
      removeUser: () => {
        set((state) => ({ ...state, user: null }));
      },
    }),
    { name: 'userStore', storage: createJSONStorage(() => sessionStorage) }
  )
);

export default userStore;
