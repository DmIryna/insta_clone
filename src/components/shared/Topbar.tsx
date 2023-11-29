import { Link, useNavigate } from "react-router-dom"
import { IoIosLogOut } from "react-icons/io"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queries"
import { useEffect } from "react"
import { useUserContext } from "@/context/AuthContext"

function Topbar() {
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const { user } = useUserContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) navigate(0)
  }, [isSuccess])

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link className="flex gap-3 items-center" to="/">
          <img
            src="/assets/icons/logo.jpg"
            alt="logo"
            className="w-12 h-12 rounded"
          />
        </Link>

        <div className="flex gap-4 items-center">
          <Link to={`/profile/${user.id}`}>
            <img
              src={user.imageURL || "/assets/icons/default-user.jpg"}
              alt="user logo"
              className="h-8 w-8 rounded-full"
            />
          </Link>
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <IoIosLogOut size={32} />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Topbar
