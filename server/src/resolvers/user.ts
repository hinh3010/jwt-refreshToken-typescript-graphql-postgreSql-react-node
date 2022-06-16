import { Arg, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql'
import { User } from '../entities/User'
import argon2 from 'argon2'
import { RegisterInput } from '../types/RegisterInput'
import { UserMutationResponse } from '../types/UserMutationResponse'
import { LoginInput } from '../types/LoginInput'
import { createToken, sendRefreshToken } from '../utils/auth';
// import { createToken, sendRefreshToken } from '../utils/auth'
import { Context } from '../types/Context'

@Resolver()
export class UserResolver {

    @Query(_return => [User])
    async users(): Promise<User[]> {
        return await User.find()
    }

    @Mutation(_return => UserMutationResponse)
    async register(@Arg('registerInput') registerInput: RegisterInput): Promise<UserMutationResponse> {
        const { username, password } = registerInput

        // kiem tra trong db co user nay chua - > tim username == username
        const existingUser = await User.findOne({ username })

        if (existingUser) {
            return {
                code: 400,
                success: false,
                message: 'Duplicated username'
            }
        }

        // hash password
        const hashedPassword = await argon2.hash(password)

        const newUser = User.create({
            username: username,
            password: hashedPassword
        })

        await newUser.save()

        return {
            code: 200,
            success: true,
            message: 'User registration successful',
            user: newUser
        }
    }

    @Mutation(_return => UserMutationResponse)
    async login(@Arg('loginInput') loginInput: LoginInput, @Ctx() { res }: Context): Promise<UserMutationResponse> {
        const { username, password } = loginInput

        // kiem tra trong db co user nay chua - > tim username == username
        const existingUser = await User.findOne({ username })

        // user sai
        if (!existingUser) {
            return {
                code: 400,
                success: false,
                message: 'User not found'
            }
        }

        // so sanh password voi password dc hash trong db
        const isPasswordValid = await argon2.verify(existingUser.password, password)

        // password sai
        if (!isPasswordValid) {
            return {
                code: 400,
                success: false,
                message: 'Incorrect password'
            }
        }

        sendRefreshToken(res, existingUser)

        return {
            code: 200,
            success: true,
            message: 'Logged in successfully',
            user: existingUser,
            accessToken: createToken('accessToken', existingUser)
        }

    }


    // @Mutation(_return => UserMutationResponse)
    // async logout(
    //     @Arg('userId', _type => ID) userId: number,
    //     @Ctx() { res }: Context
    // ): Promise<UserMutationResponse> {
    //     const existingUser = await User.findOne(userId)

    //     if (!existingUser) {
    //         return {
    //             code: 400,
    //             success: false
    //         }
    //     }

    //     existingUser.tokenVersion += 1

    //     await existingUser.save()

    //     res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, {
    //         httpOnly: true,
    //         secure: true,
    //         sameSite: 'lax',
    //         path: '/refresh_token'
    //     })

    //     return { code: 200, success: true }
    // }
}
