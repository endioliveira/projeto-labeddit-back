import { PostDatabase } from "../database/PostDatabase";
import { Post } from "../models/Post"
import { Comment } from "../models/Comment";
import { BadRequestError } from '../errors/BadRequestError'
import { CreateCommentDTO, CreatePostInputDTO, GetCommentById, GetPostById, GetPostsInputDTO, GetPostsOutputDTO, GetPostWithComments } from "../dtos/PostDTO";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CommentDB, PostCommentModel, PostCreatorDB, PostModel, PostWithComments, POST_LIKE, COMMENT_LIKE, LikeDislikePostDB, LikesDislikeCommentsDB } from "../types";
import { CommentByPostId } from "../models/CommentByPostId";
import { LikePostInputDTO } from "../dtos/PostLikesDTO"
import { LikePost } from "../models/LikePost"
import { LikeCommentInputDTO } from "../dtos/CommentLikesDTO";
import { LikeComment } from "../models/LikeComment"

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {
        const { token } = input

        if (token === undefined) {
            throw new BadRequestError("Insira o 'token'")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("O 'token' não é válido!")
        }

        const postsCreatorsDB: PostCreatorDB[] = await this.postDatabase.getPostsCreators()

        const posts = postsCreatorsDB.map((postCreatorDB) => {
            const post = new Post(
                postCreatorDB.id,
                postCreatorDB.content,
                postCreatorDB.likes,
                postCreatorDB.comments,
                postCreatorDB.created_at,
                postCreatorDB.creator_id,
                postCreatorDB.nickname
            )

            return post.toBusinessModel()
        })

        const output: GetPostsOutputDTO = posts

        return output
    }

    public createPost = async (input: CreatePostInputDTO): Promise<void> => {

        const { token, content } = input

        if (token === undefined) {
            throw new BadRequestError("Insira o 'token'")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("O 'token' não é válido!")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("O 'content' deve ser string!")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const creatorId = payload.id
        const nickname = payload.nickname

        const post = new Post(
            id,
            content,
            0,
            0,
            createdAt,
            creatorId,
            nickname
        )

        const postDB = post.toDBModel()
        await this.postDatabase.insertPost(postDB)
    }

    public getPostIdComments = async (input: GetPostById) => {

        const { postId, token } = input

        if (token === undefined) {
            throw new BadRequestError("Insira o 'token'")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("O 'token' não é válido!")
        }

        const postExist: PostWithComments = await this.postDatabase.findPostIdComments(postId)

        if (!postExist) {
            throw new BadRequestError("O 'id' não foi encontrado!")
        }


        const output: GetPostWithComments = postExist

        return output

    }

    // public getPostComments = async (input: GetPostById): Promise<PostModel> => {

    //     const { postId, token } = input

    //     if (token === undefined) {
    //         throw new BadRequestError("Insira o 'token'")
    //     }

    //     const payload = this.tokenManager.getPayload(token)

    //     if (payload === null) {
    //         throw new BadRequestError("O 'token' não é válido!")
    //     }

    //     const postExist = await this.postDatabase.findPostById(postId)

    //     if (!postExist) {
    //         throw new BadRequestError("O 'id' não foi encontrado!")
    //     }


    //     return postExist

    // }


    public createComment = async (input: CreateCommentDTO): Promise<void> => {

        const { token, postId, creatorId, content } = input

        if (token === undefined) {
            throw new BadRequestError("Insira o 'token'")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("O 'token' não é válido!")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("O 'content' deve ser string!")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()

        const comment = new Comment(
            id,
            postId,
            creatorId,
            content,
            0,
            createdAt,
        )

        const commentDB = comment.toDBModel()
        await this.postDatabase.insertComment(commentDB)
    }


    public likeDislikePost = async (input: LikePostInputDTO): Promise<void> => {
        const { idLikePost, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("Insira o 'token'")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("O 'token' não é válido!")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("O 'like' precisa ser um booleano!")
        }

        const postCreatorDB = await this.postDatabase.findPostCreatorById(idLikePost)

        if (!postCreatorDB) {
            throw new BadRequestError("O 'id' não foi encontrado!")
        }

        const userId = payload.id
        const likeDB = like ? 1 : 0

        const likeDislike: LikeDislikePostDB = {
            user_id: userId,
            post_id: postCreatorDB.id,
            like: likeDB
        }

        const post = new LikePost(
            postCreatorDB.id,
            postCreatorDB.content,
            postCreatorDB.likes,
            postCreatorDB.dislikes,
            postCreatorDB.comments,
            postCreatorDB.createdAt,
            postCreatorDB.creatorId,
            postCreatorDB.nickname
        )

        const likeDislikeExists = await this.postDatabase.findLikeDislike(likeDislike)

        if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislike)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislike)
                post.removeLike()
                post.addDislike()
            }
        } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
            if (like) {
                await this.postDatabase.updateLikeDislike(likeDislike)
                post.removeDislike()
                post.addLike()
            } else {
                await this.postDatabase.removeLikeDislike(likeDislike)
                post.removeDislike()
            }
        } else {
            await this.postDatabase.likeDislikePost(likeDislike)
            like ? post.addLike() : post.addDislike()
        }

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.updatePost(idLikePost, updatedPostDB)
    }

    public likeDislikeComment = async (input: LikeCommentInputDTO): Promise<void> => {
        const { idLikeComment, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("Insira o 'token'")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("O 'token' não é válido!")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("O 'like' precisa ser um booleano!")
        }

        const commentCreatorDB = await this.postDatabase.findCommentById(idLikeComment)

        if (!commentCreatorDB) {
            throw new BadRequestError("O 'id' não foi encontrado!")
        }

        const userId = payload.id
        const likeDB = like ? 1 : 0

        const likeDislike: LikesDislikeCommentsDB = {
            comment_id: commentCreatorDB.id,
            user_id: userId,
            like: likeDB
        }

        const comment = new LikeComment(
            commentCreatorDB.id,
            commentCreatorDB.post_id,
            commentCreatorDB.creator_id,
            commentCreatorDB.content,
            commentCreatorDB.likes,
            commentCreatorDB.dislikes,
            commentCreatorDB.created_at,
        )

        const likeDislikeExists = await this.postDatabase.findLikeDislikeComment(likeDislike)

        if (likeDislikeExists === COMMENT_LIKE.COMMENT_ALREADY_LIKED) {
            if (like) {
                await this.postDatabase.removeLikeDislikeComment(likeDislike)
                comment.removeLike()
            } else {
                await this.postDatabase.updateLikeDislikeComment(likeDislike)
                comment.removeLike()
                comment.addDislike()
            }
        } else if (likeDislikeExists === COMMENT_LIKE.COMMENT_ALREADY_DISLIKED) {
            if (like) {
                await this.postDatabase.updateLikeDislikeComment(likeDislike)
                comment.removeDislike()
                comment.addLike()
            } else {
                await this.postDatabase.removeLikeDislikeComment(likeDislike)
                comment.removeDislike()
            }
        } else {
            await this.postDatabase.likeDislikeComment(likeDislike)
            like ? comment.addLike() : comment.addDislike()
        }

        const updatedCommentDB = comment.CommentLikeDBModel()

        await this.postDatabase.updateComment(idLikeComment, updatedCommentDB)
    }
}