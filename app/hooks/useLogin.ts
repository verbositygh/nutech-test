import { useEffect, useState } from "react";
import GenericObject from "../lib/types/GenericObject";
import { useAtom } from "jotai";
import { userAuth } from "../lib/atoms/login";

const useLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [sessionInfo, setSessionInfo] = useState();
  const [_, setUserLogin] = useAtom(userAuth);
  useEffect(() => {
    const loginData = localStorage.getItem('loginData');
    if (!loginData) {
      return;
    }
    setSessionInfo(JSON.parse(loginData));
  }, [])
  useEffect(() => {
    setUserLogin(sessionInfo ?? {});
  }, [sessionInfo]) // eslint-disable-line react-hooks/exhaustive-deps
  const login = async () => {
    const doLogin = async () => {
      const generatedId = await (await fetch('/api/users/generateId', { method: 'POST' })).json();
      const loginData = await (await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(generatedId),
      })).json();
      setSessionInfo(loginData);
      localStorage.setItem('loginData', JSON.stringify(loginData));
      return loginData;
    };

    setIsLoggingIn(true);
    const loginData = await doLogin();
    setIsLoggingIn(false);
    return loginData;
  }
  const logout = async () => {
    await fetch('/api/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(sessionInfo as unknown as GenericObject)?.token ?? ''}`
      },
    });
    localStorage.removeItem('loginData');
    setSessionInfo(undefined);
  }
  return { sessionInfo, login, logout, isLoggingIn };
}

export default useLogin;
