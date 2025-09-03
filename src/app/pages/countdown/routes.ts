import { route } from "rwsdk/router";
import { 
  getCountdowns, 
  getCountdown, 
  createCountdown, 
  updateCountdown, 
  deleteCountdown,
  getCountdownConfig, 
  createCountdownConfig, 
  updateCountdownConfig 
} from "./functions";

// GET/POST /api/countdowns - Get all user's countdowns or create new countdown
export const countdownsRoute = route("/api/countdowns", async ({ request, ctx }) => {
  if (!ctx.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (request.method === "GET") {
    // GET: Return all countdowns for the user
    const countdowns = await getCountdowns(ctx.user.id);
    return Response.json(countdowns);
  } else if (request.method === "POST") {
    // POST: Create a new countdown
    try {
      const data: any = await request.json();
      
      const countdown = await createCountdown(ctx.user.id, {
        name: data.name,
        description: data.description,
        targetDate: new Date(data.targetDate),
        workDays: data.workDays || [1, 2, 3, 4, 5],
        holidays: (data.holidays || []).map((d: string) => new Date(d)),
        floatingHolidays: data.floatingHolidays || 0,
        ptoDays: data.ptoDays || 0,
        enabledWidgets: data.enabledWidgets || ["timer", "progress", "contribution", "stats"]
      });
      
      return Response.json(countdown);
    } catch (error) {
      console.error("Error creating countdown:", error);
      return Response.json({ error: "Failed to create countdown" }, { status: 500 });
    }
  }
  
  return Response.json({ error: "Method not allowed" }, { status: 405 });
});

// GET /api/countdowns/:id - Get specific countdown
export const getCountdownRoute = route("/api/countdowns/:id", async ({ ctx, params }) => {
  if (!ctx.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const countdown = await getCountdown(params.id, ctx.user.id);
  if (!countdown) {
    return Response.json({ error: "Countdown not found" }, { status: 404 });
  }
  
  return Response.json(countdown);
});

// GET/PUT/DELETE /api/countdowns/:id - Get, update, or delete specific countdown
export const countdownByIdRoute = route("/api/countdowns/:id", async ({ request, ctx, params }) => {
  if (!ctx.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (request.method === "GET") {
    // GET: Return specific countdown
    const countdown = await getCountdown(params.id, ctx.user.id);
    if (!countdown) {
      return Response.json({ error: "Countdown not found" }, { status: 404 });
    }
    return Response.json(countdown);
  } else if (request.method === "PUT") {
    // PUT: Update countdown
    try {
      const data: any = await request.json();
      const countdown = await updateCountdown(params.id, ctx.user.id, {
        name: data.name,
        description: data.description,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
        workDays: data.workDays,
        holidays: data.holidays ? data.holidays.map((d: string) => new Date(d)) : undefined,
        floatingHolidays: data.floatingHolidays,
        ptoDays: data.ptoDays,
        enabledWidgets: data.enabledWidgets
      });
      
      return Response.json(countdown);
    } catch (error) {
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }
  } else if (request.method === "DELETE") {
    // DELETE: Delete countdown
    try {
      await deleteCountdown(params.id, ctx.user.id);
      return Response.json({ success: true });
    } catch (error) {
      return Response.json({ error: "Failed to delete countdown" }, { status: 400 });
    }
  }
  
  return Response.json({ error: "Method not allowed" }, { status: 405 });
});

// Legacy routes for backward compatibility
// GET /api/countdown/config - Get user's first countdown configuration
export const getConfig = route("/api/countdown/config", async ({ ctx }) => {
  if (!ctx.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const config = await getCountdownConfig(ctx.user.id);
  return Response.json(config);
});

// POST /api/countdown/config - Create countdown configuration
export const createConfig = route("/api/countdown/config", async ({ request, ctx }) => {
  if (!ctx.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const data: any = await request.json();
    const config = await createCountdownConfig(ctx.user.id, {
      targetDate: new Date(data.targetDate),
      workDays: data.workDays || [1, 2, 3, 4, 5],
      holidays: (data.holidays || []).map((d: string) => new Date(d)),
      floatingHolidays: data.floatingHolidays || 0,
      ptoDays: data.ptoDays || 0
    });
    
    return Response.json(config);
  } catch (error) {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }
});

// PUT /api/countdown/config - Update countdown configuration
export const updateConfig = route("/api/countdown/config", async ({ request, ctx }) => {
  if (!ctx.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const data: any = await request.json();
    const config = await updateCountdownConfig(ctx.user.id, {
      targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
      workDays: data.workDays,
      holidays: data.holidays ? data.holidays.map((d: string) => new Date(d)) : undefined,
      floatingHolidays: data.floatingHolidays,
      ptoDays: data.ptoDays
    });
    
    return Response.json(config);
  } catch (error) {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }
});

export const countdownRoutes = [
  countdownsRoute,
  countdownByIdRoute,
  getConfig,
  createConfig,
  updateConfig
];
