import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import AuthShell from "@/components/auth/AuthShell";

export default function Page() {
  return (
    <AuthShell size="compact"><UpdatePasswordForm /></AuthShell>
  );
}
