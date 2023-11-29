import { sidebarLinks } from "@/constants"
import { useUserContext } from "@/context/AuthContext"
import { useSignOutAccount } from "@/lib/react-query/queries"
import { NavLinkProps } from "@/types"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { IoIosLogOut } from "react-icons/io"

function LeftSidebar() {
  const { user } = useUserContext()
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link className="flex gap-3 items-center" to="/">
          <img
            src="/assets/icons/logo.jpg"
            alt="logo"
            className="w-12 h-12 rounded"
          />
          <h3 className="h3-bold text-primary-500">Insta clone</h3>
        </Link>

        <Link to={`profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageURL || "/assets/icons/default-user.jpg"}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: NavLinkProps) => {
            const isActive = pathname === link.route
            return (
              <li
                className={`leftsidebar-link ${isActive && "bg-primary-500"}`}
                key={link.label}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.icon}
                    alt="home icon"
                    className="group-hover:invert-white"
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => signOut()}
      >
        <IoIosLogOut size={32} color="#877EFF" />
        <p className="small-medium lg:base-medium">Log out</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar
