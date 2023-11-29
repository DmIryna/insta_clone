export interface NewUser {
  name: string
  username: string
  email: string
  password: string
}

export interface ContextType {
  user: User
  isLoading: boolean
  setUser: React.Dispatch<React.SetStateAction<User>>
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  checkAuthUser: () => Promise<boolean>
}

export interface User {
  id: string
  name: string
  username: string
  email: string
  imageURL: string
  bio: string
}

export interface NavLinkProps {
  route: string
  label: string
  icon: string
}

export interface NewPost {
  userId: string
  caption: string
  file: File[]
  location: string
  tags: string
}

export interface UpdatePost {
  postId: string
  caption: string
  imageId: string
  imageURL: URL
  file: File[]
  location: string | undefined
  tags: string | undefined
}
