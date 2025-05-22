import { SignUp } from "@clerk/nextjs";
import { AuthCenter } from "@/components/auth-center";

export default function Page() {
  return (
    <AuthCenter>
      <SignUp />
    </AuthCenter>
  );
}
