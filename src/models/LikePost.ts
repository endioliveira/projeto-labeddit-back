import { PostLikesDB , PostLikesModel } from "../types"

export class LikePost {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private comments: number,
        private createdAt: string,
        private creatorId: string,
        private nickname: string,
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

    public addDislike() {
        this.dislikes += 1
    }

    public removeDislike() {
        this.dislikes -= 1
    }

    public getDislikes(): number {
        return this.dislikes
    }

    public seDislikes(value: number): void {
        this.dislikes = value
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

    public toDBModel(): PostLikesDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            comments: this.comments,
            created_at: this.createdAt,
        }
    }

    public toBusinessModel(): PostLikesModel {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            comments: this.comments,
            createdAt: this.createdAt,
            creatorId: this.creatorId,
            nickname: this.nickname
        }
    }
}