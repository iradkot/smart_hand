// examples/api/exampleApi.test.ts

import axios from 'axios';
import { fetchUserData, createUser, updateUser, deleteUser } from './exampleApi';

jest.mock('axios'); // Mock the entire axios library

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Functions', () => {

  // Grouping fetchUserData tests
  describe('fetchUserData', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear any previous mock data
    });

    test('fetches user data successfully', async () => {
      const userData = { id: 1, name: 'John Doe' };
      mockedAxios.get.mockResolvedValue({ data: userData });

      const data = await fetchUserData(1);
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/users/1');
      expect(data).toEqual(userData);
    });

    test('handles API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));
      await expect(fetchUserData(1)).rejects.toThrow('API Error');
    });
  });

  // Grouping createUser tests
  describe('createUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('creates a user successfully', async () => {
      const newUser = { name: 'Jane Doe' };
      const createdUser = { id: 2, name: 'Jane Doe' };
      mockedAxios.post.mockResolvedValue({ data: createdUser });

      const data = await createUser(newUser);
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/users', newUser);
      expect(data).toEqual(createdUser);
    });

    test('handles error during user creation', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Creation failed'));
      await expect(createUser({ name: 'Error User' })).rejects.toThrow('Creation failed');
    });
  });

  // Grouping updateUser tests
  describe('updateUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('updates a user successfully', async () => {
      const updatedUser = { id: 1, name: 'Updated John Doe' };
      mockedAxios.put.mockResolvedValue({ data: updatedUser });

      const data = await updateUser(1, { name: 'Updated John Doe' });
      expect(mockedAxios.put).toHaveBeenCalledWith('/api/users/1', { name: 'Updated John Doe' });
      expect(data).toEqual(updatedUser);
    });

    test('handles error during user update', async () => {
      mockedAxios.put.mockRejectedValue(new Error('Update failed'));
      await expect(updateUser(1, { name: 'Failing Update' })).rejects.toThrow('Update failed');
    });
  });

  // Grouping deleteUser tests
  describe('deleteUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('deletes a user successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});
      await deleteUser(1);
      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/users/1');
    });

    test('handles error during user deletion', async () => {
      mockedAxios.delete.mockRejectedValue(new Error('Delete failed'));
      await expect(deleteUser(1)).rejects.toThrow('Delete failed');
    });
  });

  // Use `beforeAll` to set up shared configurations if needed
  beforeAll(() => {
    mockedAxios.defaults.baseURL = 'http://localhost:3000'; // Example of configuring a base URL
  });
});
