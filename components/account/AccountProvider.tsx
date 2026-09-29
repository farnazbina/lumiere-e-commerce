"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { hasEnvVars } from "@/lib/utils";
import { accountStorageKey, emptyAccount as emptyData, readAccount, type AccountData } from "@/lib/account-data";
import { AccountContext } from "./use-account";

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");
  const [data, setData] = useState<AccountData>(emptyData);
  const userId = user?.id;
  const current = useRef<{ userId: string | null; data: AccountData }>({ userId: null, data: emptyData() });

  useEffect(() => {
    if (!hasEnvVars) { setError("Account sign-in is not configured."); setReady(true); return; }
    let active = true;
    const unavailable = () => {
      if (!active) return;
      setAuthError("We couldn’t connect to sign-in. Check your connection and reload to try again.");
      setReady(true);
    };
    const timeout = window.setTimeout(unavailable, 12000);
    const client = createClient();
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      window.clearTimeout(timeout);
      setAuthError("");
      setUser(session?.user ?? null);
      setReady(true);
    });
    // The auth listener does not expose initialization errors to the UI.
    void client.auth.getSession().then(({ error }) => {
      if (error) unavailable();
    }).catch(unavailable);
    return () => { active = false; window.clearTimeout(timeout); subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    let saved = emptyData();
    setError(hasEnvVars ? "" : "Account sign-in is not configured.");
    if (userId) {
      try {
        saved = readAccount(localStorage, userId);
      } catch { setError("Saved account data could not be read. Browser storage may be unavailable."); }
    }
    current.current = { userId: userId ?? null, data: saved };
    setData(saved);
  }, [userId]);

  function updateData(change: (value: AccountData) => AccountData) {
    if (!user || current.current.userId !== user.id) return false;
    const next = change(current.current.data);
    try { localStorage.setItem(accountStorageKey(user.id), JSON.stringify(next)); }
    catch { setError("Could not save your changes. Please allow browser storage and try again."); return false; }
    current.current.data = next;
    setData(next);
    setError("");
    return true;
  }

  const visibleData = current.current.userId === user?.id ? data : emptyData();
  return <AccountContext.Provider value={{ user, ready: ready && (!user || current.current.userId === user.id), error: authError || error, data: visibleData, updateData, setUser }}>{children}</AccountContext.Provider>;
}
