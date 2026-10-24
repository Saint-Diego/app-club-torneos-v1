import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { ITournament } from "../models/tournament.model";

const getTeamName = (teamId: unknown): string => {
  if (
    typeof teamId === "object" &&
    teamId !== null &&
    "name" in teamId &&
    typeof teamId.name === "string"
  ) {
    return teamId.name;
  }
  return "Equipo";
};

export class ExportService {
  public static async generateStandingsPDF(
    tournament: ITournament,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40 });
      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // Header Corporativo del Club
      doc
        .fillColor("#0f172a")
        .fontSize(20)
        .text("LigaPro Manager - Reporte Oficial", { align: "center" });
      doc
        .fontSize(12)
        .fillColor("#64748b")
        .text(`Torneo: ${tournament.name} | Tabla de Posiciones`, {
          align: "center",
        });
      doc.moveDown(2);

      // Tabla estructural
      doc.fillColor("#1e293b").fontSize(10);
      doc.text(
        "Pos  Equipo                    PJ   PG   PE   PP   GF   GC   DG   PTS",
        { underline: true },
      );
      doc.moveDown(0.5);

      tournament.standings.forEach((row, idx) => {
        const teamName = getTeamName(row.teamId).padEnd(25, " ");
        doc.text(
          `${(idx + 1).toString().padEnd(5, " ")}${teamName}${row.played.toString().padEnd(5, " ")}${row.won.toString().padEnd(5, " ")}${row.drawn.toString().padEnd(5, " ")}${row.lost.toString().padEnd(5, " ")}${row.goalsFor.toString().padEnd(5, " ")}${row.goalsAgainst.toString().padEnd(5, " ")}${row.goalsDifference.toString().padEnd(5, " ")}${row.points}`,
        );
        doc.moveDown(0.3);
      });

      doc.end();
    });
  }

  public static async generateAnalyticsExcel(
    tournament: ITournament,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    // Pestaña 1: Tabla de Posiciones
    const sheetStandings = workbook.addWorksheet("Posiciones");
    sheetStandings.columns = [
      { header: "Posición", key: "pos", width: 10 },
      { header: "Equipo", key: "team", width: 30 },
      { header: "Partidos Jugados", key: "pj", width: 15 },
      { header: "Ganados", key: "pg", width: 10 },
      { header: "Empatados", key: "pe", width: 10 },
      { header: "Perdidos", key: "pp", width: 10 },
      { header: "Goles Favor", key: "gf", width: 12 },
      { header: "Goles Contra", key: "gc", width: 12 },
      { header: "Dif Goles", key: "dg", width: 12 },
      { header: "Puntos", key: "pts", width: 12 },
    ];

    tournament.standings.forEach((row, idx) => {
      sheetStandings.addRow({
        pos: idx + 1,
        team: getTeamName(row.teamId),
        pj: row.played,
        pg: row.won,
        pe: row.drawn,
        pp: row.lost,
        gf: row.goalsFor,
        gc: row.goalsAgainst,
        dg: row.goalsDifference,
        pts: row.points,
      });
    });

    // Pestaña 2: Goleadores
    const sheetScorers = workbook.addWorksheet("Goleadores");
    sheetScorers.columns = [
      { header: "Posición", key: "pos", width: 10 },
      { header: "Jugador ID / Nombre", key: "player", width: 30 },
      { header: "Goles Anotados", key: "goals", width: 15 },
    ];

    tournament.topScorers.forEach((row, idx) => {
      sheetScorers.addRow({
        pos: idx + 1,
        player: row.playerId?.toString() || "Jugador",
        goals: row.goals,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
