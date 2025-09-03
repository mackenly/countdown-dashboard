import { PrismaClient } from "@generated/prisma";
import { PrismaD1 } from "@prisma/adapter-d1";

export type * from "@generated/prisma";

export let db: PrismaClient;
let dbInitialized = false;

// context(justinvdm, 21-05-2025): We need to instantiate the client via a
// function rather that at the module level for several reasons:
// * For prisma-client-js generator or cases where there are dynamic import to
//   the prisma wasm modules, we need to make sure we are instantiating the
//   prisma client later in the flow when the wasm would have been initialized
// * So that we can encapsulate workarounds, e.g. see `SELECT 1` workaround
//   below
export const setupDb = async (env: Env) => {
  if (dbInitialized) {
    return;
  }
  
  db = new PrismaClient({
    // context(justinvdm, 21-05-2025): prisma-client generated type appears to
    // consider D1 adapter incompatible, though in runtime (dev and production)
    // it works
    // @ts-ignore
    adapter: new PrismaD1(env.DB),
  });

  // Note: Removed $queryRaw workaround as it may be causing hanging requests
  // await db.$queryRaw`SELECT 1`;
  
  dbInitialized = true;
};
