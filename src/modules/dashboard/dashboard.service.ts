import { db } from "../../db";
import { desc, sql } from "drizzle-orm";
import { tickets } from "../../db/schema/tickets.schema";

export class DashboardService {
  async getDashboard() {
    const ticketsPorEstado = await db
      .select({
        status: tickets.status,
        total: sql<number>`count(*)`.as("total"),
      })
      .from(tickets)
      .groupBy(tickets.status);

    // 2. Total de tickets por prioridad
    const ticketsPorPrioridad = await db
      .select({
        priority: tickets.priority,
        total: sql<number>`count(*)`.as("total"),
      })
      .from(tickets)
      .groupBy(tickets.priority);

    // 3. Promedio de tiempo de resolución en horas
    const promedioResolucionResult = await db
      .select({
        promedioHoras: sql<number>`
          COALESCE(
            ROUND(
              AVG(
                EXTRACT(
                  EPOCH FROM (
                    ${tickets.resolvedAt}::timestamp - ${tickets.createdAt}::timestamp
                  )
                ) / 3600
              )::numeric,
              2
            ),
            0
          )
        `.as("promedio_horas"),
      })
      .from(tickets)
      .where(sql`${tickets.resolvedAt} IS NOT NULL`);

    // 4. Tickets abiertos más de 48 horas sin asignar
    const ticketsAbiertosSinAsignar48h = await db
      .select({
        id: tickets.id,
        title: tickets.title,
        description: tickets.description,
        status: tickets.status,
        priority: tickets.priority,
        category: tickets.category,
        createdAt: tickets.createdAt,
      })
      .from(tickets)
      .where(
        sql`
        ${tickets.status} = 'ABIERTO'
        AND ${tickets.assignedTo} IS NULL
        AND ${tickets.createdAt}::timestamp <= NOW() - INTERVAL '48 hours'
      `,
      )
      .orderBy(tickets.createdAt);

    // 5. Los 5 tickets más recientes
    const ticketsRecientes = await db
      .select({
        id: tickets.id,
        title: tickets.title,
        description: tickets.description,
        status: tickets.status,
        priority: tickets.priority,
        category: tickets.category,
        createdAt: tickets.createdAt,
        updatedAt: tickets.updatedAt,
        assignedTo: tickets.assignedTo,
        createdBy: tickets.createdBy,
        resolvedAt: tickets.resolvedAt,
      })
      .from(tickets)
      .orderBy(desc(tickets.createdAt))
      .limit(5);

    return {
      ticketsPorEstado,
      ticketsPorPrioridad,
      promedioResolucion: promedioResolucionResult[0]?.promedioHoras ?? 0,
      ticketsAbiertosSinAsignar48h,
      ticketsRecientes,
    };
  }
}
