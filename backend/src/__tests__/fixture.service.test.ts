import { FixtureService } from "../services/fixture.service";
import { Types } from "mongoose";

describe("FixtureService - Algoritmo Matemático Round Robin", () => {
  // Helpers para generar IDs de prueba de MongoDB válidos
  const generateMockTeamIds = (count: number): Types.ObjectId[] => {
    return Array.from({ length: count }, () => new Types.ObjectId());
  };

  test("Debe generar el número correcto de jornadas para un torneo CORTO con equipos PARES", () => {
    const teams = generateMockTeamIds(6); // 6 equipos
    const fixture = FixtureService.generateRoundRobin(teams, "Corto");

    // N - 1 jornadas = 5 jornadas
    expect(fixture).toHaveLength(5);

    // Cada jornada debe tener N / 2 partidos = 3 partidos
    fixture.forEach((round, index) => {
      expect(round.roundNumber).toBe(index + 1);
      expect(round.matches).toHaveLength(3);
    });
  });

  test("Debe generar el número correcto de jornadas para un torneo LARGO (Ida y Vuelta) con equipos PARES", () => {
    const teams = generateMockTeamIds(4); // 4 equipos
    const fixture = FixtureService.generateRoundRobin(teams, "Largo");

    // (N - 1) * 2 = 6 jornadas
    expect(fixture).toHaveLength(6);
    expect(fixture[0].matches).toHaveLength(2);
  });

  test('Debe gestionar correctamente equipos IMPARES aplicando un "Bye" de forma automática', () => {
    const teams = generateMockTeamIds(5); // 5 equipos (Impar)
    const fixture = FixtureService.generateRoundRobin(teams, "Corto");

    // Con 5 equipos el algoritmo agrega un "Fantasma", convirtiéndolo en 6 elementos.
    // Resulta en 5 jornadas, pero eliminando el partido donde está el fantasma (Bye).
    // Por lo tanto, cada ronda debe tener exactamente 2 partidos jugables en lugar de 3.
    expect(fixture).toHaveLength(5);
    fixture.forEach((round) => {
      expect(round.matches.length).toBeLessThanOrEqual(2);
    });
  });

  test("Garantizar la integridad empírica: Ningún equipo debe jugar dos veces en la misma jornada", () => {
    const teams = generateMockTeamIds(8);
    const fixture = FixtureService.generateRoundRobin(teams, "Corto");

    fixture.forEach((round) => {
      const visitedTeams = new Set<string>();

      round.matches.forEach((match) => {
        expect(match.home).not.toBeNull();
        expect(match.away).not.toBeNull();

        const homeStr = match.home!.toString();
        const awayStr = match.away!.toString();

        expect(visitedTeams.has(homeStr)).toBe(false);
        expect(visitedTeams.has(awayStr)).toBe(false);

        visitedTeams.add(homeStr);
        visitedTeams.add(awayStr);
      });
    });
  });

  test("Inversión perfecta de localías en la segunda vuelta de torneos Largos", () => {
    const teams = generateMockTeamIds(4);
    const fixture = FixtureService.generateRoundRobin(teams, "Largo");

    // Primera Jornada vs Cuarta Jornada (Espejo de Ida y Vuelta)
    const round1Match = fixture[0].matches[0];
    const round4Match = fixture[3].matches[0];

    expect(round1Match.home!.toString()).toBe(round4Match.away!.toString());
    expect(round1Match.away!.toString()).toBe(round4Match.home!.toString());
  });
});
