import React from 'react'
import { useHelloQuery } from '../../generated/graphql'

type Props = {}

export default function Profile({ }: Props) {

    const { data, error, loading } = useHelloQuery({ fetchPolicy: 'no-cache' })

    if (loading) return <h1>loading</h1>

    if (error) return <h1>Error {JSON.stringify(error.message)}</h1>

    return (
        <div>{data?.hello}</div>
    )
}