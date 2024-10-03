// examples/api/exampleApi.ts

import axios from 'axios';

/**
 * Fetches user data from an API.
 * @param userId The ID of the user.
 * @returns A promise that resolves to the user data.
 */
export async function fetchUserData(userId: number): Promise<{ id: number; name: string }> {
  const response = await axios.get(`/api/users/${userId}`);
  return response.data;
}

/**
 * Creates a new user via an API POST request.
 * @param user The user data to create.
 * @returns A promise that resolves to the created user data.
 */
export async function createUser(user: { name: string }): Promise<{ id: number; name: string }> {
  const response = await axios.post(`/api/users`, user);
  return response.data;
}

/**
 * Updates user data via an API PUT request.
 * @param userId The ID of the user.
 * @param userData The updated user data.
 * @returns A promise that resolves to the updated user data.
 */
export async function updateUser(
  userId: number,
  userData: { name: string }
): Promise<{ id: number; name: string }> {
  const response = await axios.put(`/api/users/${userId}`, userData);
  return response.data;
}

/**
 * Deletes a user via an API DELETE request.
 * @param userId The ID of the user to delete.
 * @returns A promise that resolves when the user is deleted.
 */
export async function deleteUser(userId: number): Promise<void> {
  await axios.delete(`/api/users/${userId}`);
}
