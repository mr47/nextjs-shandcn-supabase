"use client"

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GuestbookForm({ onMessageAdded }: { onMessageAdded?: () => void }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.from("guestbook").insert({ name, message });
    if (error) setError(error.message);
    else {
      setName("");
      setMessage("");
      onMessageAdded?.();
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign the Guestbook</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            placeholder="Your message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            disabled={loading}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Add Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
