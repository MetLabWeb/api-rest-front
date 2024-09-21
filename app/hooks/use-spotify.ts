import { useEffect, useState } from "react";

export const useSpotify = () => {
  // Following state and functions are for handling
  // saving and reading token from localStorage
  const [currentToken, setCurrentToken] = useState<{
    access_token: string | null;
    refresh_token: string | null;
    expires_in: string | null;
    expires: string | null;
    token: string | null;
  }>();

  const saveTokenToLocalStorage = (token: any) => {
    const { access_token, refresh_token, expires_in } = token;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("expires_in", expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + expires_in * 1000);
    localStorage.setItem("expires", expiry.toString());
    localStorage.setItem("token", JSON.stringify(token));
  };

  const updateTokenFromLocalStorage = () => {
    setCurrentToken({
      access_token: localStorage.getItem("access_token") || null,
      refresh_token: localStorage.getItem("refresh_token") || null,
      expires_in: localStorage.getItem("refresh_in") || null,
      expires: localStorage.getItem("expires") || null,
      token: localStorage.getItem("token") || null,
    });
  };
  useEffect(() => {
    updateTokenFromLocalStorage();
  }, []);

  return {
    currentToken,
    saveTokenToLocalStorage,
    updateTokenFromLocalStorage,
  };
};
