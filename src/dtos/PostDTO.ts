import { PostModel, PostWithComments } from "../types"

export interface GetPostsInputDTO {
    token: string | undefined
}

export type GetPostsOutputDTO = PostModel[]

export type  GetPostWithComments = PostWithComments

export interface CreatePostInputDTO {
    token: string | undefined,
    content: unknown
}

export interface GetPostById {
    postId: string,
    token: string | undefined
}

export interface GetCommentById {
    commentId: string,
    token: string | undefined
}

export interface CreateCommentDTO {
    token: string,
    postId: string,
    creatorId: string,
    content: string
}