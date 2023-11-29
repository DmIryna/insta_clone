import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react"
import { ContextType, User } from "@/types"
import { getCurrentUser } from "@/lib/appwrite/api"
import { useNavigate } from "react-router-dom"

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageURL: "",
  bio: "",
}

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<ContextType>(INITIAL_STATE)

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  const checkAuthUser = async () => {
    setIsLoading(true)
    try {
      const currentAccount = await getCurrentUser()

      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageURL: currentAccount.imageURL,
          bio: currentAccount.bio,
        })
        setIsAuthenticated(true)
        return true
      }

      return false
    } catch (error) {
      console.log(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (
      localStorage.getItem("cookieFallback") === "[]" ||
      localStorage.getItem("cookieFallback") === null
    )
      navigate("/sign-in")

    checkAuthUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoading,
        setIsAuthenticated,
        checkAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useUserContext = () => useContext(AuthContext)
