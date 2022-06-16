import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { useLoginMutation, useRegisterMutation } from '../../generated/graphql'
import JWTManager from '../../utils/jwt'


export default function Register() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const [register, _] = useRegisterMutation()

    const [login, __] = useLoginMutation()
    const { setIsAuthenticated } = useAuthContext()
    const [error, setError] = useState('')

    const handleSubmitRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const resRegister = await register({
            variables: {
                registerInput: { username, password }
            }
        })

        // console.log(resRegister.data?.register?.success)
        // if ma dang ki thanh cong cho login luon
        if (resRegister.data?.register?.success) {
            alert(resRegister.data?.register?.message)
            const res = await login({
                variables: {
                    loginInput: { username, password }
                }
            })
            if (res.data?.login?.success) {
                // console.log({ asset: res.data.login.accessToken })
                JWTManager.setToken(res.data.login.accessToken as string)
                setIsAuthenticated(true)
                navigate('..')
            } else {
                return false
            }
        } else {
            // console.log({ error: resRegister.data?.register?.message })
            if (resRegister.data?.register?.message) {
                setError(resRegister.data.register?.message)
            }
        }
    }

    return (
        <>
            {error && <h3 style={{ color: 'red' }}> {error}</h3>}

            <form style={{ marginTop: '1rem' }} onSubmit={handleSubmitRegister}>
                <input
                    type="text"
                    value={username}
                    placeholder='Username'
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    value={password}
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                >Register</button>
            </form>
        </>
    )
}