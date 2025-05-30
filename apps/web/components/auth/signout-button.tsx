import { signOut } from "next-auth/react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export function SignOut() {
  return (
    <form
      action={async () => {
        await signOut({ callbackUrl: "/" });
      }}
    >
      <DropdownMenuItem asChild>
        <button
          type="submit"
          className="w-full"
        >
          <LogOut />
          Log out
        </button>
      </DropdownMenuItem>
    </form>
  );
}
