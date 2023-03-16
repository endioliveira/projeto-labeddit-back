export interface TokenPayload {
    id: string,
    nickname: string,
}

export interface UserDB {
    id: string,
    nickname: string,
    email: string,
    password: string,
    created_at: string
}

export interface UserModel {
    id: string,
    nickname: string,
    email: string,
    password: string,
    createdAt: string
}

export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    comments: number,
    created_at: string,
}

export interface PostCreatorDB extends PostDB {
    nickname: string
}

export interface PostModel {
    id: string,
    content: string,
    likes: number,
    comments: number,
    createdAt: string,
    creator: {
        id: string
        nickname: string
    }
}

export interface PostWithCreator {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    comments: number,
    created_at: string,
    nickname: string,
} 

export interface PostCommentModel {
    id: string,
    content: string,
    likes: number,
    comments: number,
    createdAt: string,
    creator: {
        id: string
        nickname: string
    },
    commentsPost: {
        commentId: string,
        commentPostId: string,
        commentContent: string,
        commentLikes: number,
        commentCreatedAt: string
    }
}

export interface LikeDislikePostDB {
    user_id: string,
    post_id: string,
    like: number
}

export enum POST_LIKE {
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"
}

export interface CommentsDB {
    id: string,
    post_id: string,
    creator_id: string,
    content: string,
    likes: number,
    created_at: string
}


export interface LikesDislikeCommentsDB {
    user_id: string,
    comment_id: string,
    like: number
}

export interface LikesDislikeCommentsModel {
    userId: string,
    commentId: string,
    like: number
}

export interface CommentDB {
    id: string,
    post_id: string,
    creator_id: string,
    content: string,
    likes: number,
    created_at: string
}

export interface CommentModel {
    id: string,
    postId: string,
    creatorId: string,
    content: string,
    likes: number,
    createdAt: string,
}

export interface PostWithComments {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    comments: number,
    created_at: string,
    nickname: string,
    post_comments: PostCommentModel[]
}
