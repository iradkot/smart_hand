// utils/loggingUtils.ts


export const logInfo = (message: string) => {
  console.log(`[INFO]: ${message}`);
  // Optionally send to external logging service
  // axios.post('https://logging.service/logs', { level: 'info', message });
};
