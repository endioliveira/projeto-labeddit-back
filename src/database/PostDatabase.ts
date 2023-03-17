import { PostDB, PostCreatorDB, LikeDislikePostDB, POST_LIKE, PostModel, CommentDB, PostCommentModel, PostWithComments, PostWithCreator, PostLikesModel, LikesDislikeCommentsDB, CommentsWithLikes, COMMENT_LIKE } from "../types"
import { BaseDatabase } from "./BaseDatabase"

export class PostDatabase extends BaseDatabase {
  static TABLE_POSTS = "posts"
  static TABLE_LIKES_DISLIKES_POSTS = "likes_dislikes_posts"
  static TABLE_COMMENTS = "comments"
  static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments"

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

  public async findPostCreatorById(postId: string): Promise<PostLikesModel | undefined> {
    const result: PostLikesModel[] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select(
        "posts.id",
        "posts.creator_id",
        "posts.content",
        "posts.likes",
        "posts.dislikes",
        "posts.comments",
        "posts.created_at",
        "users.nickname"
      )
      .join("users", "posts.creator_id", "=", "users.id")
      .where("posts.id", postId)
    return result[0]
  }

  public async findCommentById(commentId: string): Promise<CommentsWithLikes | undefined>{
    const result: CommentsWithLikes[] = await BaseDatabase
      .connection(PostDatabase.TABLE_COMMENTS)
      .select(
        'comments.id',
        'comments.post_id',
        'comments.creator_id',
        'comments.content',
        'comments.likes',
        'comments.dislikes',
        'comments.created_at',
      ).where('comments.id', commentId)

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


  public async updatePost(id: string, postDB: PostDB): Promise<void> {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .update(postDB)
      .where({ id })

  }

  public async updateComment(id: string, commentDB: CommentDB): Promise<void> {
    await BaseDatabase.connection(PostDatabase.TABLE_COMMENTS)
      .update(commentDB)
      .where({ id })

  }

  public async likeDislikePost(likeDislike: LikeDislikePostDB): Promise<void> {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POSTS)
      .insert(likeDislike)
  }

  public async findLikeDislike (likeDislikeDBToFind: LikeDislikePostDB): Promise<POST_LIKE | null> {
    const [likeDislikeDB]: LikeDislikePostDB[] = await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES_POSTS)
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

  public async removeLikeDislike (likeDislikeDB: LikeDislikePostDB):Promise<void> {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POSTS)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })
  }

  public async updateLikeDislike (likeDislikeDB: LikeDislikePostDB) {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_POSTS)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        post_id: likeDislikeDB.post_id
      })
  }

  // --------------------------- COMMENTS ----------------------------------------------------

  public async likeDislikeComment(likeDislike: LikesDislikeCommentsDB): Promise<void> {
    console.log(likeDislike)
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .insert(likeDislike)
  }

  public async findLikeDislikeComment (likeDislikeDBToFind: LikesDislikeCommentsDB): Promise<COMMENT_LIKE | null> {
    const [likeDislikeDB]: LikesDislikeCommentsDB[] = await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .select()
      .where({
        user_id: likeDislikeDBToFind.user_id,
        comment_id: likeDislikeDBToFind.comment_id
      })

    if (likeDislikeDB) {
      return likeDislikeDB.like === 1
        ? COMMENT_LIKE.COMMENT_ALREADY_LIKED
        : COMMENT_LIKE.COMMENT_ALREADY_DISLIKED

    } else {
      return null
    }
  }

  public async removeLikeDislikeComment (likeDislikeDB: LikesDislikeCommentsDB):Promise<void> {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id
      })
  }

  public async updateLikeDislikeComment (likeDislikeDB: LikesDislikeCommentsDB) {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id
      })
  }
}