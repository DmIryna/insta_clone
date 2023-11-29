import { ID, Query } from "appwrite"
import { NewPost, NewUser, UpdatePost } from "@/types"
import { account, avatars, databases, appwriteConfig, storage } from "./config"

export async function createUserAccount(user: NewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )

    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(user.name)

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageURL: avatarUrl,
    })

    return newUser
  } catch (error) {
    console.log(error)
    return error
  }
}

export async function saveUserToDB(user: {
  accountId: string
  email: string
  name: string
  imageURL: URL
  username?: string
}) {
  try {
    console.log(user)
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user
    )
    return newUser
  } catch (error) {
    console.log(error)
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password)

    return session
  } catch (error) {
    console.log(error)
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get()
    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )
    if (!currentUser) throw Error

    return currentUser.documents.at(0)
  } catch (error) {
    console.error(error)
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current")

    return session
  } catch (error) {
    console.error(error)
  }
}

export async function createPost(post: NewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0])
    if (!uploadedFile) throw Error

    const fileUrl = getFilePreview(uploadedFile.$id)
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    const tags = post?.tags.replace(/ /g, "").split(",") || []

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageURL: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    )

    if (!newPost) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }
    console.log(`new post`, newPost)
    return newPost
  } catch (error) {
    console.log(error)
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    )
    console.log(`uploadedFile`, uploadedFile)
    return uploadedFile
  } catch (error) {
    console.log(error)
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    )

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error) {
    console.log(error)
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)

    return { status: "ok" }
  } catch (error) {
    console.log(error)
  }
}

export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    )
    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      }
    )
    if (!updatedPost) throw Error

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    )
    if (!updatedPost) throw Error

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    )
    if (!statusCode) throw Error

    return { status: "ok" }
  } catch (error) {
    console.log(error)
  }
}

export async function getPostById(postId?: string) {
  if (!postId) throw Error
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    )

    return post
  } catch (error) {
    console.log(error)
  }
}

export async function updatePost(post: UpdatePost) {
  // const hasFileToUpdate = post.file.length > 0
  console.log(`api`, post)
  try {
    let image = {
      imageURL: post.imageURL,
      imageId: post.imageId,
    }

    const uploadedFile = await uploadFile(post.file[0])
    if (!uploadedFile) throw Error

    const fileUrl = getFilePreview(uploadedFile.$id)
    if (!fileUrl) {
      deleteFile(uploadedFile.$id)
      throw Error
    }

    image = { ...image, imageURL: fileUrl, imageId: uploadedFile.$id }

    const tags = post?.tags?.replace(/ /g, "").split(",") || []

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageURL: image.imageURL,
        imageId: image.imageId,
        location: post?.location,
        tags: tags,
      }
    )
    if (!updatedPost) {
      await deleteFile(post.imageId)
      throw Error
    }

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    )

    return { status: "ok" }
  } catch (error) {
    console.log(error)
  }
}