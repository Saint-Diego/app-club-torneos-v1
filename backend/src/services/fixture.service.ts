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
    if (!teams.length) return [];

    const list: (Types.ObjectId | null)[] = [...teams];
    if (list.length % 2 !== 0) {
      list.push(null);
    }

    const totalTeams = list.length;
    const fixture: Round[] = [];

    for (let roundIndex = 0; roundIndex < totalTeams - 1; roundIndex++) {
      const matches: MatchSlot[] = [];

      for (let matchIndex = 0; matchIndex < totalTeams / 2; matchIndex++) {
        const homeIndex = (roundIndex + matchIndex) % (totalTeams - 1);
        let awayIndex =
          (totalTeams - 1 - matchIndex + roundIndex) % (totalTeams - 1);

        if (matchIndex === 0) {
          awayIndex = totalTeams - 1;
        }

        const home = list[homeIndex];
        const away = list[awayIndex];

        if (home && away) {
          matches.push(
            roundIndex % 2 === 0 ? { home, away } : { home: away, away: home },
          );
        }
      }

      fixture.push({
        roundNumber: roundIndex + 1,
        matches,
      });
    }

    if (type === "Largo") {
      const firstLegLength = fixture.length;

      for (let roundIndex = 0; roundIndex < firstLegLength; roundIndex++) {
        const mirroredMatches = fixture[roundIndex].matches.map((match) => ({
          home: match.away,
          away: match.home,
        }));

        fixture.push({
          roundNumber: firstLegLength + roundIndex + 1,
          matches: mirroredMatches,
        });
      }
    }

    return fixture;
  }
}
