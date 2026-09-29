import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import AuthShell from "@/components/auth/AuthShell";

export default function Page() {
  return (
    <AuthShell size="compact"><ForgotPasswordForm /></AuthShell>
  );
}
