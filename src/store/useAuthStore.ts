import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  setToken: (token: string | null) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user) => set({user, isAuthenticated: !!user}),

  setToken: async (token) => {
    if (token) {
      await AsyncStorage.setItem('@compra_eficiente_token', token);
    } else {
      await AsyncStorage.removeItem('@compra_eficiente_token');
    }
    set({token});
  },

  logout: async () => {
    await AsyncStorage.removeItem('@compra_eficiente_token');
    set({user: null, token: null, isAuthenticated: false});
  },
}));
