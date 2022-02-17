import { useSessionStorage } from "react-use";
import { atom, useRecoilValue } from "recoil";

export const atomUser = atom<
  | undefined
  | null
  | { uid: string; }
>({ key: "user", default: null });

export const useAuth = ():
  | { loading: true; }
  | { loading: false; user: null; }
  | { loading: false; user: { uid: string; }; } =>
{
  const user = useRecoilValue(atomUser);
  if (user === undefined) return { loading: true };
  else return { loading: false, user };
};

export const useAuthToken = (): [string | null, (newToken: string) => void] => {
  const [token, setToken] = useSessionStorage<string | null>("sno2wiki-token", null);

  const updateToken = (newToken: string) => setToken(newToken);
  return [token, updateToken];
};
