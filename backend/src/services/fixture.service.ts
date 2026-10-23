import { Types } from "mongoose";

interface MatchSlot {
  home: Types.ObjectId | null;
  away: Types.ObjectId | null;
}

interface Round {
  roundNumber: number;
  matches: MatchSlot[];
}

export class FixtureService {
  public static generateRoundRobin(
    teams: Types.ObjectId[],
    type: "Corto" | "Largo",
  ): Round[] {
    const list = [...teams];
    const hasGhost = list.length % 2 !== 0;

    if (hasGhost) {
      list.push(null as any); // Representa un "Bye" para jornadas impares
    }

    const numTeams = list.length;
    const roundsCount = numTeams - 1;
    const matchesPerRound = numTeams / 2;
    const fixture: Round[] = [];

    for (let r = 0; r < roundsCount; r++) {
      const currentRoundMatches: MatchSlot[] = [];
      for (let m = 0; m < matchesPerRound; m++) {
        const homeIndex = (r + m) % (numTeams - 1);
        let awayIndex = (numTeams - 1 - m + r) % (numTeams - 1);

        if (m === 0) {
          awayIndex = numTeams - 1;
        }

        const home = list[homeIndex];
        const away = list[awayIndex];

        if (home !== null && away !== null) {
          // Alternar localía en cada jornada
          if (r % 2 === 0) {
            currentRoundMatches.push({ home, away });
          } else {
            currentRoundMatches.push({ home: away, away: home });
          }
        }
      }
      fixture.push({ roundNumber: r + 1, matches: currentRoundMatches });
    }

    // Si es tipo Largo (Ida y vuelta) replicamos invirtiendo la localía
    if (type === "Largo") {
      const secondLegCount = fixture.length;
      for (let r = 0; r < secondLegCount; r++) {
        const mirroredMatches = fixture[r].matches.map((m) => ({
          home: m.away,
          away: m.home,
        }));
        fixture.push({
          roundNumber: secondLegCount + r + 1,
          matches: mirroredMatches,
        });
      }
    }

    return fixture;
  }
}
