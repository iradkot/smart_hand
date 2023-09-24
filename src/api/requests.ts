import { smartHandServer } from './axiosInstances'

export const askGPTPost = async (question: string): Promise<any> => {
  try {
    const response = await smartHandServer.post('/chat', {
      messages: [question],
    })
    return response.data
  } catch (error) {
    console.log('error in asking gpt:', error)
    throw error
  }
}
