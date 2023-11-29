import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signupValidation } from "@/lib/validation"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queries"
import { useUserContext } from "@/context/AuthContext"

function SignupForm() {
  const { toast } = useToast()

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount()
  const { mutateAsync: signInAccount } = useSignInAccount()
  const { checkAuthUser } = useUserContext()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(user: z.infer<typeof signupValidation>) {
    const newUser = await createUserAccount(user)

    if (!newUser) {
      toast({ title: "Sign up failed. Please try again" })
      return
    }

    const session = signInAccount({
      email: user.email,
      password: user.password,
    })

    if (!session) {
      toast({ title: "Sign up failed. Please try again" })
      return
    }

    const isLoggedIn = await checkAuthUser()
    if (isLoggedIn) {
      form.reset()
      navigate("/")
    } else {
      toast({ title: "Sign in failed. Please try again" })
      return
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420px flex-center flex-col">
        <img
          src="/assets/icons/logo.jpg"
          alt="logo icon"
          className="w-12 h-12 rounded"
        />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use SocialGram, please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingUser ? (
              <div className="flex gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm
