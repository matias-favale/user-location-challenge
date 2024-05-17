import {client} from "@/client/client.ts";
import {UserRegistrationRequest, UserSession} from "@/types/user-location.ts";

export const register = async function (requestData: Partial<UserRegistrationRequest>): Promise<UserSession> {
    const response = await client.post('/register', requestData);
    return response.data;
}