import { PostDatabase } from "../database/PostDatabase";
import { Post } from "../models/Post"
import { BadRequestError } from '../errors/BadRequestError'
import { CreatePostInputDTO, GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/PostDTO";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import {  PostCreatorDB, POST_LIKE } from "../types";
// import { LikeDisliketInputDTO } from "../dtos/LikeDislikeDTO";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

}