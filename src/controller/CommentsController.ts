import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { BaseError } from "../errors/BaseError"
import { CreatePostInputDTO,  GetPostsInputDTO } from "../dtos/PostDTO"
// import { LikeDisliketInputDTO } from "../dtos/LikeDislikePostDTO"

export class PostController {
  constructor(
    private postBusiness: PostBusiness
  ) { }

}
