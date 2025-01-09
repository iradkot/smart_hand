export const errorHandler = ({event}) => {

  throw new Error(event.error);
};
