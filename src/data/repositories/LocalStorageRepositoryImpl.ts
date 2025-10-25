import type { LocalStorageRepository } from '../../core/repositories/LocalStorageRepository';

export class LocalStorageRepositoryImpl implements LocalStorageRepository {
  private encrypt(value: string): string {
    try {
      // Simple encryption using base64 encoding
      return btoa(encodeURIComponent(value));
    } catch (error) {
      console.error('Encryption failed:', error);
      return value;
    }
  }

  private decrypt(value: string): string {
    try {
      // Decryption using base64 decoding
      return decodeURIComponent(atob(value));
    } catch (error) {
      console.error('Decryption failed:', error);
      return value;
    }
  }

  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const encryptedValue = localStorage.getItem(key);
      if (encryptedValue) {
        return this.decrypt(encryptedValue);
      }
      return null;
    } catch (error) {
      console.error('Failed to get item from localStorage:', error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    try {
      const encryptedValue = this.encrypt(value);
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Failed to set item in localStorage:', error);
    }
  }

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove item from localStorage:', error);
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}
