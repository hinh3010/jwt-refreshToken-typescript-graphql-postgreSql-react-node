import React, { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useState } from 'react'
import JWTManager from '../utils/jwt'

interface IAuthContext {
    isAuthenticated: boolean
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>
    checkAuth: () => Promise<void>,
    logoutClient: () => void
}

const defaultIsAuthenticated = false

export const AuthContext = createContext<IAuthContext>({
    isAuthenticated: defaultIsAuthenticated,
    setIsAuthenticated: () => { },
    checkAuth: () => Promise.resolve(),
    logoutClient: () => { }
})

export const useAuthContext = () => useContext(AuthContext)

export default function AuthContextProvider({ children }: { children: ReactNode }) {

    const [isAuthenticated, setIsAuthenticated] = useState(defaultIsAuthenticated)

    // check xem co dang nhap hay ko
    const checkAuth = useCallback(
        async () => {
            const token = JWTManager.getToken()

            // neu ma co token thi setIsAuthenticated = true
            // => logged
            if (token)
                setIsAuthenticated(true)
            // neu ma ko co token thi Refresh Token 
            else {
                const success = await JWTManager.getRefreshToken()
                // neu Refresh Token thanh cong => trong cookies co ma refreshToken 
                // => user logged
                if (success) setIsAuthenticated(true)
                else setIsAuthenticated(false)
            }

        }, []
    )

    const logoutClient = async () => {
        JWTManager.deleteToken()
        setIsAuthenticated(false)
    }

    const authContextData = {
        isAuthenticated, setIsAuthenticated, checkAuth, logoutClient
    }

    return <AuthContext.Provider value={authContextData}>
        {children}
    </AuthContext.Provider>

}
