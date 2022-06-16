import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql'
import { checkAuth } from './../middleware/checkAuth';
import { Context } from './../types/Context';
import { User } from './../entities/User';


@Resolver()
export class GreetingResolver {
    @Query(_return => String)
    @UseMiddleware(checkAuth)


    async hello(@Ctx() { user }: Context): Promise<string> {

        // console.log({user})

        const existingUser = await User.findOne(user.userId)
        return `Hello ${existingUser ? existingUser.username : 'World'}`
    }
}