import jwtDecode, { JwtPayload } from "jwt-decode"

const JWTManager = () => {

    const LOGOUT_EVENT_NAME = 'jwt-logout'

    let inMemoryToken: string | null = null
    let refreshTokenTimeoutId: number | null = null
    let userId: number | null = null

    const getToken = () => inMemoryToken
    const setToken = (accessToken: string) => {
        inMemoryToken = accessToken

        // Giải mã token và đặt đếm ngược để làm mới token
        const decoded = jwtDecode<JwtPayload & { userId: number }>(accessToken)
        userId = decoded.userId
        setRefreshTokenTimeout((decoded.exp as number) - (decoded.iat as number))
        return true
    }

    const setRefreshTokenTimeout = (delay: number) => {
        // 5s trước khi mã thông báo hết hạn
        refreshTokenTimeoutId = window.setTimeout(
            getRefreshToken,
            delay * 1000 - 5000
        )
    }

    const getRefreshToken = async () => {
        try {
            const response = await fetch('http://localhost:3333/refresh_token', {
                credentials: 'include'
            })
            const data = (await response.json()) as {
                success: boolean
                accessToken: string
            }
            // console.log({ data })

            // thay token cu === token moi 
            setToken(data.accessToken)
            return true
        } catch (error) {
            console.log('UNAUTHENTICATED', error)
            deleteToken()
            return false
        }
    }

    const abortRefreshToken = () => {
        if (refreshTokenTimeoutId) window.clearTimeout(refreshTokenTimeoutId)
    }

    const deleteToken = () => {
        inMemoryToken = null
        abortRefreshToken()
        window.localStorage.setItem(LOGOUT_EVENT_NAME, Date.now().toString())
        return true
    }

    // Đăng xuất tất cả các tab (vô hiệu hóa inMemoryToken)
    window.addEventListener('storage', event => {
        if (event.key === LOGOUT_EVENT_NAME) {
            inMemoryToken = null
        }
    })

    const getUserId = () => userId

    return { getToken, setToken, getRefreshToken, deleteToken, getUserId }
}

// export vaf goi ham luon => co mat moi luc moi noi
export default JWTManager()