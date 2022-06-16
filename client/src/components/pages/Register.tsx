import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../../generated/graphql'

type Props = {}

export default function Register({ }: Props) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const [register, _] = useRegisterMutation()

    const handleSubmitRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await register({
            variables: {
                registerInput: { username, password }
            }
        })
        navigate('..')
    }

    return (

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
    )
}