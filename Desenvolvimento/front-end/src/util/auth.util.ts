import Swal from 'sweetalert2';

export const isLoggedIn = () => {
  const user = sessionStorage.getItem('auth_token');
  return user !== null;
};

export enum TipoPessoa {
  Company = 0,
  Developer = 1
}

interface UserData {
  user_name: string;
  id_pessoa: number;
  tipo_pessoa: TipoPessoa;
  token: string;
}

export const getUserName = (): string => {
  const user_name = getUser().user_name
  return user_name;
}

export const getUser = (): UserData => {
  const user = sessionStorage.getItem('auth_token');
  if (user === null) {
    logOff();
    Swal.fire({
      type: 'error',
      title: 'Por favor, efetue login novamente',
      text: 'Sua sessão expirou!'
    });
    window.location.href = '/login';
    throw new Error('Sua sessão expirou');
  }
  try {
    return JSON.parse(user) as UserData;
  } catch (error) {
    logOff();
    Swal.fire({
      type: 'error',
      title: 'Por favor, efetue login novamente',
      text: 'Sua sessão expirou!'
    });
    window.location.href = '/login';
    throw error;
  }
};

export const setAuth = (token: string) => {
  sessionStorage.setItem('auth_token', token);
};

export const getAuth = () => {
  return sessionStorage.getItem('auth_token');
};

export const logOff = () => {
  sessionStorage.removeItem('auth_token');
};