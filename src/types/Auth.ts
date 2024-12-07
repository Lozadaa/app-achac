export type RequestState = 'success' | 'error' | 'loading' | 'idle';

export type ResponseAuth<T> = {
  status: {
    code: number,
    message: string,
    data?: T,
  }
};

export type UserResponse = {
  id: number;
  token: string;
  email: string;
  name: string;
  status: string;
}
