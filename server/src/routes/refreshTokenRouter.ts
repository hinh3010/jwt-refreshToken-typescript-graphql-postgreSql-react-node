import express from 'express'
import { Secret, verify } from 'jsonwebtoken';
import { UserAuthPayload } from 'src/types/UserAuthPayload';
import { User } from './../entities/User';
import { createToken, sendRefreshToken } from './../utils/auth';


const router = express.Router()

router.get('/', async (req, res) => {
    // console.log(req.cookies)
    // console.log(req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string])
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string]

    if (!refreshToken) return res.status(401).json({ error: 'Refresh token not found | Unauthorized' })

    try {
        const decodedUser = verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as Secret
        ) as UserAuthPayload

        const existingUser = await User.findOne(decodedUser.userId)

        if (!existingUser || existingUser.tokenVersion !== decodedUser.tokenVersion)
            res.status(401).json({ error: '....' })

        sendRefreshToken(res, existingUser as User)

        return res.status(200).json({
            success: true,
            accessToken: createToken('accessToken', existingUser as User)
        })

    } catch (error) {
        return res.status(403).json({ error: error })
    }
})

export default router