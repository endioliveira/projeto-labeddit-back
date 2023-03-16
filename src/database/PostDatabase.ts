import { PostDB, PostCreatorDB, LikeDislikePostDB, POST_LIKE, PostModel, CommentDB, PostCommentModel, PostWithComments, PostWithCreator } from "../types"
import { BaseDatabase } from "./BaseDatabase"

export class PostDatabase extends BaseDatabase {
  static TABLE_POSTS = "posts"
  static TABLE_LIKES_DISLIKES = "likes_dislikes"
  static TABLE_COMMENTS = "comments"

  public async getPostsCreators(): Promise<PostCreatorDB[]> {
    const result: PostCreatorDB[] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select(
        "posts.id",
        "posts.creator_id",
        "posts.content",
        "posts.likes",
        "posts.comments",
        "posts.created_at",
        "users.nickname"
      )
      .join("users", "posts.creator_id", "=", "users.id")
      .orderBy('posts.created_at', 'desc')

    return result
  }

  public async insertPost(newPostDB: PostDB): Promise<void> {
    await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .insert(newPostDB)
  }

  public async insertComment(newCommentDB: CommentDB): Promise<void> {
    await BaseDatabase
      .connection(PostDatabase.TABLE_COMMENTS)
      .insert(newCommentDB)
  }

  public async findPostById(postId: string): Promise<PostModel> {
    const postDB: PostModel[] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select(
        "posts.id",
        "posts.creator_id",
        "posts.content",
        "posts.likes",
        "posts.comments",
        "posts.created_at",
        "users.nickname",
        "users.nickname AS creator_nickname"
      )
      .join("users", "posts.creator_id", "=", "users.id")
      .where("posts.id", postId)

    return postDB[0]
  }


  public async findPostCreatorById(postId: string): Promise<PostModel | undefined> {
    const result: PostModel[] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select(
        "posts.id",
        "posts.creator_id",
        "posts.content",
        "posts.likes",
        "posts.comments",
        "posts.created_at",
        "users.nickname"
      )
      .join("users", "posts.creator_id", "=", "users.id")
      .where("posts.id", postId)
    return result[0]
  }

  public async findPostIdComments(postId: string): Promise<PostWithComments> {
    const post: PostWithCreator[] = await
      BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .select(
          "posts.id",
          "posts.creator_id",
          "posts.content",
          "posts.likes",
          "posts.comments",
          "posts.created_at",
          "users.nickname"
        )
        .join("users", "posts.creator_id", "=", "users.id")
        .where("posts.id", postId)

    const postComments: PostCommentModel[] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select(
        "comments.id",
        "comments.post_id",
        "comments.creator_id",
        "comments.content",
        "comments.likes",
        "comments.created_at",
        "users.nickname"

      )
      .join("users", "comments.creator_id", "=", "users.id")
      .join("comments", "posts.id", "=", "comments.post_id")
      .orderBy('comments.created_at', 'desc')

      .where("posts.id", postId)
    let postData: PostWithComments = {
      id: post[0].id,
      creator_id: post[0].creator_id,
      content: post[0].content,
      likes: post[0].likes,
      comments: post[0].comments,
      created_at: post[0].created_at,
      nickname: post[0].nickname,
      post_comments: postComments
    }
    return postData
  }


  public async likeDislikePost(likeDislike: LikeDislikePostDB): Promise<void> {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .insert(likeDislike)
  }

  public async findLikeDislike(likeDislikeDBToFind: LikeDislikePostDB): Promise<POST_LIKE | null> {
    const [likeDislikeDB]: LikeDislikePostDB[] = await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .select()
      .where({
        user_id: likeDislikeDBToFind.user_id,
        post_id: likeDislikeDBToFind.post_id
      })

    if (likeDislikeDB) {
      return likeDislikeDB.like === 1
        ? POST_LIKE.ALREADY_LIKED
        : POST_LIKE.ALREADY_DISLIKED

    } else {
      return null
    }
  }

  public async removeLikeDislike(likeDislikeDB: LikeDislikePostDB): Promise<void> {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })
  }

  public async updateLikeDislike(likeDislikeDB: LikeDislikePostDB) {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })
  }
}