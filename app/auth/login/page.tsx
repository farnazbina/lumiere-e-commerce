import { LoginForm } from "@/components/auth/LoginForm";
import AuthShell from "@/components/auth/AuthShell";

export default function Page() {
  return (
    <AuthShell size="login"><LoginForm /></AuthShell>
  );
}
