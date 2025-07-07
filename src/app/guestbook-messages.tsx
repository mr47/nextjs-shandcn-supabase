"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GuestbookMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("guestbook")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    setMessages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMessages();
    const supabase = createClient();
    const channel = supabase
      .channel("guestbook-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "guestbook",
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages]);

  return (
    <div className="mt-8">
      <div className="font-semibold mb-2">Recent Messages</div>
      <ul className="flex flex-col gap-2">
        {loading && <li className="text-muted-foreground text-sm">Loading...</li>}
        {!loading && messages.length === 0 && (
          <li className="text-muted-foreground text-sm">No messages yet.</li>
        )}
        {messages.map((msg) => (
          <li key={msg.id} className="border rounded p-2 bg-background/60">
            <div className="font-medium">{msg.name}</div>
            <div className="text-sm text-muted-foreground">{msg.message}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(msg.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
