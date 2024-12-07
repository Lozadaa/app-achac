import { UserResponse } from "@/types/Auth";
import { Preferences } from "@capacitor/preferences";

export const getUser = async (): Promise<UserResponse | null> => {
    const userResponse = await Preferences.get({ key: 'user' });
    return userResponse.value ? JSON.parse(userResponse.value) : null;
}