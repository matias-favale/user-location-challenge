import { createContext, useReducer } from 'react'
import {UserSession} from "@/types/user-location.ts";

interface Props {
  children: React.ReactNode
}

interface AuthContextPayload {
  user?: UserSession
  isLoggedIn?: boolean
}

interface AuthContextState {
  isLoggedIn: boolean
  user?: UserSession | null
}

interface AuthContextAction {
  payload?: AuthContextPayload
}

const initialState = {
  isLoggedIn: false,
  user: null,
}

const reducer = (state: AuthContextState, action: AuthContextAction) => {
    return {
      ...state,
      ...action.payload,
    }
}

const AuthContext = createContext<{
  state: AuthContextState
  dispatch: React.Dispatch<AuthContextAction>
}>({
  state: initialState,
  dispatch: () => null,
})

const AuthProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
