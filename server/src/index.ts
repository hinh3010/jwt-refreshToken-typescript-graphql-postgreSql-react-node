require('dotenv').config()
import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import { User } from './entities/User'
import { createServer } from 'http'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { GreetingResolver } from './resolvers/greeting'
import { UserResolver } from './resolvers/user'
import { Context } from './types/Context'
import refreshTokenRouter from './routes/refreshTokenRouter'

const main = async () => {
    await createConnection({
        type: 'postgres',
        database: 'jwt-auth-xuanhinh',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        logging: true,
        synchronize: true,
        entities: [User]
    })

    const _cors = { origin: 'http://localhost:3000', credentials: true }

    const app = express();
    app.use(cors(_cors))
    app.use(cookieParser())
    app.use('/refresh_token', refreshTokenRouter)

    const httpServer = createServer(app)

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            validate: false,
            resolvers: [GreetingResolver, UserResolver]
        }),
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground
        ],
        context: ({ req, res }): Pick<Context, 'req' | 'res'> => ({ req, res })
    })

    await apolloServer.start()

    apolloServer.applyMiddleware({ app, cors: _cors })

    const PORT = process.env.PORT || 3333

    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve as () => void,))

    // Typically, http://localhost:4000/graphql
    console.log(
        `SERVER STARTED ON PORT ${PORT}. GRAPHQL ENDPOINT ON http://localhost:${PORT}${apolloServer.graphqlPath}`
    )
}

main().catch(err => console.error('server loi roi kia', err))