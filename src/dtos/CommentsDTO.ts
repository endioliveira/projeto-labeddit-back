import { CommentModel } from "../types"

export interface GetCommentsInputDTO {
    token: string | undefined
}

export type GetCommentsOutputDTO = CommentModel[]

export interface CreateCommentInputDTO {
    token: string | undefined,
    content: unknown
}