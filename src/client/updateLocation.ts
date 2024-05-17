import {client} from "@/client/client.ts";
import {UpdateLocationRequest, UpdateLocationResponse} from "@/types/location.ts";

export const updateLocation = async function (requestData: Partial<UpdateLocationRequest>): Promise<UpdateLocationResponse> {
    const response = await client.post<UpdateLocationResponse>('/updateLocation', requestData);
    return response.data;
}