import {client} from "@/client/client.ts";
import {UsersNearMeResponse} from "@/types/location.ts";

export const listUsersNearMe = async function (): Promise<UsersNearMeResponse[]> {
    const response = await client.get<UsersNearMeResponse[]>('/usersnearme');
    // console.log(response);
    return response.data;
}