import { signIn } from "@/auth"
import { RiGoogleFill } from "react-icons/ri";
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
      <button className="border-slate-700 border-2  w-fit mt-44 rounded p-2 bg-zinc-800 text-white hover:border-black" type="submit"><p>Signin with Google<RiGoogleFill className="flex w-full content-center "/></p></button>
    </form>
  )
} 