import React from 'react'
import { useUsersQuery } from './../../generated/graphql';

type Props = {}

export default function Home({ }: Props) {

    const { data, error, loading } = useUsersQuery({ fetchPolicy: 'no-cache' })

    if (loading) return <h1>loading</h1>

    if (error) return <h1>Error {JSON.stringify(error)}</h1>

    return (
        <ul>
            {data?.users.map(user => (
                <li key={user.id}>{user.username}</li>
            ))}
        </ul>
    )
}