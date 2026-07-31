export type ResponseType<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    message: string;
  } & T;
};
