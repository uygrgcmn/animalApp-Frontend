import { useEffect } from "react";

import { useSessionStore } from "../store/sessionStore";

export function SessionBootstrap() {
  const bootstrap = useSessionStore((state) => state.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return null;
}

