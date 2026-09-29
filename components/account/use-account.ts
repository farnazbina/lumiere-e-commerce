"use client";

import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";
import type { AccountData } from "@/lib/account-data";

type AccountContextValue = {
  user: User | null;
  ready: boolean;
  error: string;
  data: AccountData;
  updateData: (change: (data: AccountData) => AccountData) => boolean;
  setUser: (user: User | null) => void;
};

export const AccountContext = createContext<AccountContextValue | null>(null);

export function useAccount() {
  const value = useContext(AccountContext);
  if (!value) throw new Error("AccountProvider is required");
  return value;
}
