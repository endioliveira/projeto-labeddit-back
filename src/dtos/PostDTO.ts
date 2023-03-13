import { PostModel } from "../types"

export interface GetPostsInputDTO {
    token: string | undefined
}

export type GetPostsOutputDTO = PostModel[]

export interface CreatePostInputDTO {
    token: string | undefined,
    content: unknown
}

export interface GetPostById {
    postId: string,
    token: string | undefined
}