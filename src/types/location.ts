import {UserSession} from "@/types/user-location.ts";

export interface UpdateLocationFormData {
    positionX: number
    positionY: number
    distance: number
}

export type UpdateLocationRequest = Pick<UserSession, 'positionX' | 'positionY' | 'distance'>

export type UpdateLocationResponse = UserSession

export interface UsersNearMeResponse {
    u1_username: string
    u1_positionX: number
    u1_positionY: number
    u2_username: string
    u2_positionX: number
    u2_positionY: number
    ud_distance: number
    userOneId: number
    userTwoId: number
}

export type HandleUpdateLocationForm = (data: Partial<Partial<UpdateLocationRequest>>,
                                        onError?: (apiError?: {}) => void) => void