export const getToken = (): string | null => {
    return localStorage.getItem("token");
  };
  
  export const isAuthenticated = (): boolean => {
    return !!getToken();
  };
  
  export const setToken = (token: string) => {
    localStorage.setItem("token", token);
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
  };
  