import { useState, MouseEvent, useEffect } from "react"
import {
  useGetCurrentUser,
  useDeleteSavedPost,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queries"
import { Models } from "appwrite"

import {
  GoHeart,
  GoHeartFill,
  GoBookmark,
  GoBookmarkFill,
} from "react-icons/go"
import Loader from "./Loader"
import { checkIsLiked } from "@/lib/utils"

interface PostStatsProps {
  post: Models.Document
  userId: string
}

function PostStats({ post, userId }: PostStatsProps) {
  const likesList = post.likes.map((user: Models.Document) => user.$id)
  const { mutate: likePost } = useLikePost()
  const { mutate: savePost, isPending: isSavingPost } = useSavePost()
  const { mutate: deleteSavedPost, isPending: isDeletingPost } =
    useDeleteSavedPost()

  const { data: currentUser } = useGetCurrentUser()
  const [likes, setLikes] = useState(likesList)
  const [isSaved, setIsSaved] = useState(false)

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  )

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])

  const handleLikePost = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    let newLikes = [...likes]
    if (newLikes.includes(userId))
      newLikes = newLikes.filter((id) => id !== userId)
    else newLikes.push(userId)

    setLikes(newLikes)
    likePost({ postId: post.$id, likesArray: newLikes })
  }

  const handleSavePost = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (savedPostRecord) {
      setIsSaved(false)
      deleteSavedPost(savedPostRecord.$id)
    } else {
      savePost({ postId: post.$id, userId })
      setIsSaved(true)
    }
  }

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <button onClick={(e) => handleLikePost(e)} className="cursor-pointer">
          {checkIsLiked(likes, userId) ? (
            <GoHeartFill fill="red" size={20} />
          ) : (
            <GoHeart size={20} />
          )}
        </button>
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {isSavingPost || isDeletingPost ? (
          <Loader />
        ) : (
          <button onClick={(e) => handleSavePost(e)} className="cursor-pointer">
            {isSaved ? (
              <GoBookmarkFill fill="gray" size={20} />
            ) : (
              <GoBookmark size={20} />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default PostStats
