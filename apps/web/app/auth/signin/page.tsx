
import { signIn } from "@/lib/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("bitbucket")
      }}
    >
      <button type="submit">Signin with Bitbucket</button>
    </form>
  )
} 