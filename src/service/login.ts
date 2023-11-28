import openApi from './axios';

export async function login(username: string, password: string) {
  return await openApi.post('/user/login', {
    username,
    password
  });
}

export async function register(registerUser: any) {
  return await openApi.post('/user/register', registerUser);
}
