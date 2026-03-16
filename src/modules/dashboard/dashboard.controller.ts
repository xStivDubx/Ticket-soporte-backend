import { Context } from "hono";
import { DashboardService } from "./dashboard.service";

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  async getAll(context: Context) {
    const userLogin = context.get("user");
    console.log("Usuario en contexto:", userLogin);

    if (userLogin.role !== "AGENTE") {
      return context.json(
        {
          message: "No tienes permisos para ver el dashboard",
        },
        403,
      );
    }

    const dashboardData = await this.dashboardService.getDashboard();
    return context.json({
      message: "Dashboard",
      data: dashboardData,
    });
  }
}
