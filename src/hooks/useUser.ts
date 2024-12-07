// create hook that use the getUser async and returns the value of the user

import { useEffect, useState } from "react";
import { UserResponse } from "@/types/Auth";
import { getUser } from "@/utils/userUtils";
import { Preferences } from "@capacitor/preferences";

export const useUser = (): {user: UserResponse | null, logout: Function } => {
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  const logout = () => {
    Preferences.clear();
    window.location.href = '/login';
  }


  return { user, logout };
}