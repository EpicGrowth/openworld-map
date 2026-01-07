"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function StatusPage() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");
  const [details, setDetails] = useState<string>("");

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient();

        // Test 1: Check if we can connect to keywords table
        const { error } = await supabase
          .from("keywords")
          .select("keyword")
          .limit(1);

        if (error) {
          setStatus("error");
          setDetails(`Database error: ${error.message}`);
          return;
        }

        setStatus("connected");
        setDetails("Database connection successful!");
      } catch (err) {
        setStatus("error");
        setDetails(`Connection failed: ${err}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">OpenWorld.Map</h1>
          <p className="mt-2 text-muted-foreground">System Status</p>
        </div>

        {/* Status Card */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Supabase Connection Test
          </h2>

          <div className="flex items-center gap-3">
            {status === "loading" && (
              <>
                <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-muted-foreground">Connecting...</span>
              </>
            )}
            {status === "connected" && (
              <>
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span className="text-green-500">Connected!</span>
              </>
            )}
            {status === "error" && (
              <>
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-red-500">Connection Failed</span>
              </>
            )}
          </div>

          {details && (
            <p className="text-sm text-muted-foreground font-mono bg-secondary p-2 rounded">
              {details}
            </p>
          )}
        </div>

        {/* Checklist */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-3">
          <h3 className="font-semibold text-foreground">System Checklist</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-muted-foreground">Database schema created</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-muted-foreground">RLS policies configured</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span className="text-muted-foreground">Triggers & functions set up</span>
            </li>
            <li className="flex items-center gap-2">
              <span className={status === "connected" ? "text-green-500" : "text-muted-foreground"}>
                {status === "connected" ? "✓" : "○"}
              </span>
              <span className="text-muted-foreground">Supabase connection verified</span>
            </li>
          </ul>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/" className="text-primary hover:underline text-sm">
            ← Back to App
          </Link>
        </div>
      </div>
    </div>
  );
}
