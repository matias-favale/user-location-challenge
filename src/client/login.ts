import {client} from "@/client/client.ts";
import {AxiosResponse} from "axios";

export const login = async function (): Promise<AxiosResponse> {
    const response = await client.get('/login');
    console.log("Successfully logged in user", response.data);
    return response;
}