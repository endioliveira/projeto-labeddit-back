import { PostCommentModel, PostDB, PostModel } from "../types"

export class CommentByPostId {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private comments: number,
        private createdAt: string,
        private creatorId: string,
        private nickname: string,
        private commentId: string, 
        private commentPostId: string,
        private commentContent: string,
        private commentLikes: number, 
        private commentCreatedAt: string
    ) {}

    public getId(): string {
        return this.id
    }

    public setId(value: string): void {
        this.id = value
    }

    public getContent(): string {
        return this.content
    }

    public setContent(value: string): void {
        this.content = value
    }

    public getLikes(): number {
        return this.likes
    }

    public setLikes(value: number): void {
        this.likes = value
    }

    public addLike() {
        this.likes += 1
    }

    public removeLike() {
        this.likes -= 1
    }

    public getComments(): number {
        return this.comments
    }

    public seComments(value: number): void {
        this.comments = value
    }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public getCreatorId(): string {
        return this.creatorId
    }

    public setCreatorId(value: string): void {
        this.creatorId = value
    }

    public getNickName(): string {
        return this.nickname
    }

    public setNickName(value: string): void {
        this.nickname = value
    }

    public getCommentId(): string {
        return this.commentId
    }

    public setCommentId(value: string): void {
        this.commentId = value
    }
    public getCommentPostId(): string {
        return this.commentPostId
    }

    public setCommentPostId(value: string): void {
        this.commentPostId = value
    }

    public getCommentContent(): string {
        return this.commentContent
    }

    public setCommentContent(value: string): void {
        this.commentContent = value
    }

    public getCommentLikes(): number {
        return this.commentLikes
    }

    public setCommentLikes(value: number): void {
        this.commentLikes = value
    }

    public getCommentCreatedAt(): string {
        return this.commentCreatedAt
    }

    public setCommentCreatedAt(value: string): void {
        this.commentCreatedAt = value
    }

    public toDBModel(): PostDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            likes: this.likes,
            comments: this.comments,
            created_at: this.createdAt,
        }
    }

    public toBusinessModel(): PostModel {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            comments: this.comments,
            createdAt: this.createdAt,
            creator: {
                id: this.creatorId,
                nickname: this.nickname
            }
        }
    }
    public toPostCommentBusinessModel(): PostCommentModel {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            comments: this.comments,
            createdAt: this.createdAt,
            creator: {
                id: this.creatorId,
                nickname: this.nickname
            },
            commentsPost: {
                commentId: this.commentId,
                commentPostId: this.commentPostId,
                commentContent: this.commentContent,
                commentLikes: this.commentLikes,
                commentCreatedAt: this.commentCreatedAt
            }
        }
    }


}