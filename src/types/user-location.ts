// UserSession type

export interface UserSession {
    id: number
    username: string
    sessionId: string
    positionX: number
    positionY: number
    distance: number
}

export interface UserRegistrationFormData {
    username: string
}

export type UserRegistrationRequest = Pick<UserSession, 'username'>

export type HandleRegisterUserForm = (data: Partial<UserRegistrationRequest>,
                                      onError?: (apiError?: {}) => void) => void
