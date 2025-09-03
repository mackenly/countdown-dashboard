import { defineDurableSession } from "rwsdk/auth";

export let sessions: ReturnType<typeof createSessionStore>;
let sessionStoreInitialized = false;

const createSessionStore = (env: Env) =>
  defineDurableSession({
    sessionDurableObject: env.SESSION_DURABLE_OBJECT,
  });

export const setupSessionStore = (env: Env) => {
  if (sessionStoreInitialized) {
    return sessions;
  }
  
  sessions = createSessionStore(env);
  sessionStoreInitialized = true;
  return sessions;
};
