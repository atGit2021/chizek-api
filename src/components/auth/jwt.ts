export const getJwt = (authorization: string) => {
  if (authorization && authorization.startsWith('Bearer')) {
    return authorization.split(' ')[1];
  }
};
