const JWTManager = () => {
    let isMemoryToken: string | null = null

    const getToken = () => isMemoryToken

    const setToken = (accessToken: string) => isMemoryToken = accessToken

    return { getToken, setToken }
}

// export vaf goi ham luon => co mat moi luc moi noi
export default JWTManager()