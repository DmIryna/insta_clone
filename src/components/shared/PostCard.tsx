import { multiFormatDateString } from "@/lib/utils"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import { BiEdit } from "react-icons/bi"
import { useUserContext } from "@/context/AuthContext"
import PostStats from "./PostStats"

function PostCard({ post }: Models.Document) {
  const { user } = useUserContext()

  if (!post.creator) return

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={post?.creator?.imageURL || "/assets/icons/default-user.jpg"}
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        {user.id === post.creator.$id && (
          <Link to={`update-post/${post.$id}`}>
            <span>
              <BiEdit size={20} fill="gray" />
            </span>
          </Link>
        )}
      </div>

      <Link to={`posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img src={post.imageURL} alt="post image" className="post-card_img" />
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  )
}

export default PostCard
