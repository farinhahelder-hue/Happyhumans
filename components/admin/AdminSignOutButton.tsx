"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminSignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full px-4 py-2 text-sm text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-800 hover:text-white transition"
    >
      Se déconnecter
    </button>
  );
}
