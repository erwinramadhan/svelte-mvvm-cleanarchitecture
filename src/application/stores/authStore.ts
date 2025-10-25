import { writable, derived } from 'svelte/store';
import type { User } from '../../core/models/User';
import type { LocalStorageRepository } from '../../core/repositories/LocalStorageRepository';
import { LocalStorageRepositoryImpl } from '../../data/repositories/LocalStorageRepositoryImpl';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Load from localStorage if available
function loadFromStorage(storage: LocalStorageRepository): AuthState {
  const token = storage.getItem('auth_token');
  const userStr = storage.getItem('auth_user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        ...initialState,
        user,
        token,
        isAuthenticated: true,
      };
    } catch (error) {
      console.error('Failed to parse auth state from storage:', error);
    }
  }
  
  return initialState;
}

// Create the store
function createAuthStore(storage: LocalStorageRepository = new LocalStorageRepositoryImpl()) {
  const { subscribe, set, update } = writable<AuthState>(loadFromStorage(storage));

  return {
    subscribe,
    
    setLoading: (isLoading: boolean) => {
      update(state => ({ ...state, isLoading, error: null }));
    },
    
    setError: (error: string | null) => {
      update(state => ({ ...state, error, isLoading: false }));
    },
    
    login: (user: User, token: string) => {
      // Save to localStorage with encryption
      storage.setItem('auth_token', token);
      storage.setItem('auth_user', JSON.stringify(user));
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    },
    
    logout: async () => {
      try {
        // Call API to invalidate the session
        const token = storage.getItem('auth_token');
        if (token) {
          // Importing here to avoid circular dependency
          const { AuthApiDataSource } = await import('../../data/datasources/AuthApiDataSource');
          const dataSource = new AuthApiDataSource();
          await dataSource.logout();
        }
      } catch (error) {
        console.error('Logout API call failed:', error);
        // Continue with logout even if API call fails
      } finally {
        // Clear localStorage
        storage.removeItem('auth_token');
        storage.removeItem('auth_user');
        
        set(initialState);
      }
    },
    
    updateUser: (user: User) => {
      // Update localStorage
      storage.setItem('auth_user', JSON.stringify(user));
      
      update(state => ({
        ...state,
        user,
      }));
    },
    
    reset: () => {
      storage.removeItem('auth_token');
      storage.removeItem('auth_user');
      set(initialState);
    },
  };
}

export const authStore = createAuthStore();

// Derived stores for convenient access
export const currentUser = derived(authStore, $auth => $auth.user);
export const isAuthenticated = derived(authStore, $auth => $auth.isAuthenticated);
export const authError = derived(authStore, $auth => $auth.error);
export const authLoading = derived(authStore, $auth => $auth.isLoading);
