import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/user.model";
import { Club } from "../models/club.model";
import { Team } from "../models/team.model";
import { Player } from "../models/player.model";
import { Tournament } from "../models/tournament.model";
import { Match } from "../models/match.model";
import { FixtureService } from "../services/fixture.service";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/club_deportivo";

const seedDatabase = async () => {
  try {
    console.log(
      "🔄 Iniciando conexión a MongoDB para el proceso de seeding...",
    );
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conexión establecida.");

    // 1. LIMPIEZA DE COLECCIONES PREVIAS
    console.log("🗑️ Limpiando colecciones de la base de datos...");
    await User.deleteMany({});
    await Club.deleteMany({});
    await Team.deleteMany({});
    await Player.deleteMany({});
    await Tournament.deleteMany({});
    await Match.deleteMany({});
    console.log("✅ Base de datos limpia.");

    // 2. CREACIÓN DE USUARIOS ESTRUCTURALES (RBAC)
    console.log("👥 Creando credenciales y perfiles de usuarios con roles...");
    const hashedPass = await bcrypt.hash("Password123!", 12);

    const adminUser = await User.create({
      name: "Super Admin",
      email: "admin@ligapro.com",
      passwordHash: hashedPass,
      role: "Admin",
    });

    const organizadorUser = await User.create({
      name: "Carlos Organizador",
      email: "organizador@ligapro.com",
      passwordHash: hashedPass,
      role: "Organizador",
    });

    const delegadoUser1 = await User.create({
      name: "Juan Delegado Boca",
      email: "boca@ligapro.com",
      passwordHash: hashedPass,
      role: "Delegado",
    });

    const delegadoUser2 = await User.create({
      name: "Andrés Delegado River",
      email: "river@ligapro.com",
      passwordHash: hashedPass,
      role: "Delegado",
    });

    console.log("✅ Usuarios del ecosistema creados.");

    // 3. CREACIÓN DE CLUBES Y SEDES
    console.log("🏢 Creando entidades de Clubes...");
    const club1 = await Club.create({
      name: "Atlético Boca Juniors Club",
      hqAddress: "Calle Falsa 123",
      delegateId: delegadoUser1._id,
    });

    const club2 = await Club.create({
      name: "River Plate Deportivo",
      hqAddress: "Avenida Siempre Viva 742",
      delegateId: delegadoUser2._id,
    });

    // 4. CREACIÓN DE EQUIPOS
    console.log("⚽ Creando Equipos categorizados...");
    const teamNames = [
      "Boca Juniors FC",
      "River Plate FC",
      "Racing Club",
      "Independiente FC",
    ];
    const createdTeams = [];

    // Mapeo dinámico simple para poblar 4 equipos base
    for (let i = 0; i < teamNames.length; i++) {
      const clubRef = i % 2 === 0 ? club1 : club2;
      const team = await Team.create({
        name: teamNames[i],
        clubId: clubRef._id,
        category: "Libre",
        shieldUrl: `https://placehold.co{teamNames[i].substring(0,3)}`,
      });
      createdTeams.push(team);
    }
    console.log(`✅ ${createdTeams.length} Equipos listos.`);

    // 5. POBLAR JUGADORES Y ARQUEROS TITULARES
    console.log("🏃‍♂️ Poblando jugadores obligatorios por plantilla...");
    for (const team of createdTeams) {
      // Registrar Arquero (Crucial para el módulo analítico de valla menos vencida)
      await Player.create({
        teamId: team._id,
        dni: `GK-${team._id.toString().substring(18)}`,
        jerseyNumber: 1,
        position: "Arquero",
      });

      // Registrar 3 jugadores de campo de prueba
      for (let j = 2; j <= 4; j++) {
        await Player.create({
          teamId: team._id,
          dni: `DNI-${team._id.toString().substring(18)}-${j}`,
          jerseyNumber: j * 3,
          position:
            j === 2 ? "Defensor" : j === 3 ? "Mediocampista" : "Delantero",
        });
      }
    }
    console.log("✅ Plantillas de jugadores indexadas.");

    // 6. CREACIÓN DE TORNEO Y ACTIVACIÓN AUTOMÁTICA DEL FIXTURE ROUND ROBIN
    console.log("🏆 Instanciando Torneo Oficial de Apertura...");
    const teamIds = createdTeams.map((t) => t._id as mongoose.Types.ObjectId);

    const initialStandings = teamIds.map((tId) => ({
      teamId: tId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalsDifference: 0,
      points: 0,
    }));

    const tournament = new Tournament({
      name: "Torneo Apertura 2026 - Primera División",
      type: "Corto",
      teams: teamIds,
      standings: initialStandings,
      isActive: true,
    });
    await tournament.save();

    console.log("📅 Generando Fixture matemático automatizado...");
    const rounds = FixtureService.generateRoundRobin(teamIds, "Corto");

    let matchCount = 0;
    for (const round of rounds) {
      for (const slot of round.matches) {
        if (slot.home && slot.away) {
          await Match.create({
            tournamentId: tournament._id,
            round: round.roundNumber,
            homeTeamId: slot.home,
            awayTeamId: slot.away,
            isPlayed: false,
          });
          matchCount++;
        }
      }
    }

    console.log(
      `🎉 [SEED EXITOSO] Se han inyectado todos los datos base con éxito.`,
    );
    console.log(`📊 Torneo Creado ID: ${tournament._id}`);
    console.log(`📅 Total Partidos Agendados en el Fixture: ${matchCount}`);

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Error crítico ejecutando los seeds de la base de datos:",
      error,
    );
    process.exit(1);
  }
};

seedDatabase();
