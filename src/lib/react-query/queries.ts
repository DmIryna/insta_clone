import { NewPost, NewUser, UpdatePost } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createUserAccount,
  signOutAccount,
  signInAccount,
  createPost,
  getRecentPosts,
  likePost,
  savePost,
  deleteSavedPost,
  getCurrentUser,
  getPostById,
  updatePost,
  deletePost,
} from "../appwrite/api"
import { QUERY_KEYS } from "./queryKeys"

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: NewUser) => createUserAccount(user),
  })
}

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  })
}

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post: NewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
    },
  })
}

export const useGetRecentPosts = () => {
  return useQuery({
    queryFn: getRecentPosts,
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string
      likesArray: string[]
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      })
    },
  })
}

export const useSavePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      })
    },
  })
}

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      })
    },
  })
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryFn: getCurrentUser,
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
  })
}

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryFn: () => getPostById(postId),
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    enabled: !!postId,
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: UpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      })
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })
    },
  })
}
