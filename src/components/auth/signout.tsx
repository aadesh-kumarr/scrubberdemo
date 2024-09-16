import { signOut } from "@/auth"
import { RiGoogleFill } from "react-icons/ri";
 
export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
            <button className="border-zinc-700 border-2  w-fit rounded p-2 bg-zinc-800 text-white hover:border-black" type="submit"><p className="flex  content-center gap-2 py-2">Signout<RiGoogleFill className="text-2xl"/></p></button>
    </form>
  )
}