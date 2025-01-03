// src/utils/createCompressedStorage.ts

import { compressToUTF16, decompressFromUTF16 } from 'lz-string'
import { PersistStorage, StorageValue } from 'zustand/middleware'

/**
 * A factory that creates a PersistStorage that compresses data before saving
 * and decompresses data when loading.
 */
export function createCompressedStorage<S>(
  getStorage: () => Storage
): PersistStorage<S> {
  const storage = getStorage()

  return {
    /**
     * Retrieves the item from storage, decompresses it, and parses into StorageValue<S>.
     */
    getItem: async (name: string): Promise<StorageValue<S> | null> => {
      try {
        const compressed = storage.getItem(name)
        if (!compressed) return null
        const decompressed = decompressFromUTF16(compressed)
        if (!decompressed) return null

        // `decompressed` should be a stringified StorageValue<S>
        return JSON.parse(decompressed) as StorageValue<S>
      } catch (error) {
        console.error('Error during getItem in compressedStorage:', error)
        return null
      }
    },

    /**
     * Compresses the JSON-stringified StorageValue<S> and saves it to storage.
     */
    setItem: async (name: string, value: StorageValue<S>): Promise<void> => {
      try {
        // `value` includes { state: S, version?: number }
        const json = JSON.stringify(value)
        const compressed = compressToUTF16(json)
        storage.setItem(name, compressed)
      } catch (error) {
        console.error('Error during setItem in compressedStorage:', error)
      }
    },

    /**
     * Removes the item from storage.
     */
    removeItem: async (name: string): Promise<void> => {
      try {
        storage.removeItem(name)
      } catch (error) {
        console.error('Error during removeItem in compressedStorage:', error)
      }
    },
  }
}
