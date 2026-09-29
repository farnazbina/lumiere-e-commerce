import { SignUpForm } from "@/components/auth/SignUpForm";
import AuthShell from "@/components/auth/AuthShell";

export default function Page() {
  return (
    <AuthShell size="compact"><SignUpForm /></AuthShell>
  );
}
