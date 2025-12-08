import { useEffect, useState } from "react";

export const useSession = () => {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    let session = localStorage.getItem("reading_sessionId");

    if (!session) {
      session = crypto.randomUUID();
      localStorage.setItem("reading_sessionId", session);
    }

    setSessionId(session);
  }, []);

  return sessionId;
};