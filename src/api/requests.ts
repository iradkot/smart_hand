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

export const createUser = async (userData: any): Promise<any> => {
  try {
    const response = await smartHandServer.post('/users', userData)
    return response.data
  } catch (error) {
    console.log('error in creating user:', error)
    throw error
  }
}

export const askGPTForFileName = async (content: string): Promise<string> => {
  try {
    const response = await smartHandServer.post('/chat', {
      messages: [content],
    })
    // Assuming the response contains a 'filename' field
    return response.data.filename
  } catch (error) {
    console.log('error in asking gpt for file name:', error)
    throw error
  }
}
