import { Field, ObjectType } from 'type-graphql'
import { User } from '../entities/User'
import { IMutationResponse } from './MutationResponse'

@ObjectType({ implements: IMutationResponse })
export class UserMutationResponse implements IMutationResponse {

    // cac Field su dung tu IMutationResponse
    code: number
    success: boolean
    message?: string

    // cac Field rieng
    @Field({ nullable: true })
    user?: User

    @Field({ nullable: true })
    accessToken?: string
}
