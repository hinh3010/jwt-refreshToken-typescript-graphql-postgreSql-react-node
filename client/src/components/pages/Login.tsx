import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { useLoginMutation } from '../../generated/graphql'
import JWTManager from '../../utils/jwt'

type Props = {}

export default function Login({ }: Props) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState('')

    const navigate = useNavigate()
    const [login, _] = useLoginMutation()

    const { setIsAuthenticated } = useAuthContext()

    const handleSubmitLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await login({
            variables: {
                loginInput: { username, password }
            }
        })
        if (res.data?.login.success) {
            // console.log({ asset: res.data.login.accessToken })
            JWTManager.setToken(res.data.login.accessToken as string)
            setIsAuthenticated(true)
            navigate('..')
        } else {
            // console.log({ error: res.data?.login.message })
            if (res.data?.login.message) {
                setError(res.data.login.message)
            }
        }
    }

    return (
        <>
            {error && <h3 style={{ color: 'red' }}> {error}</h3>}
            <form style={{ marginTop: '1rem' }} onSubmit={handleSubmitLogin}>
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
                >Login</button>
            </form>
        </>
    )
}