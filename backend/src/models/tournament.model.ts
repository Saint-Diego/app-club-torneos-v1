import { Schema, model, Document } from "mongoose";

export interface IStandingRow {
  teamId: Schema.Types.ObjectId;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDifference: number;
  points: number;
}

export interface IScorerRow {
  playerId: Schema.Types.ObjectId;
  teamId: Schema.Types.ObjectId;
  goals: number;
}

export interface IGoalkeeperRow {
  playerId: Schema.Types.ObjectId;
  teamId: Schema.Types.ObjectId;
  goalsConceded: number;
  minutesPlayed: number;
}

export interface ITournament extends Document {
  name: string;
  type: "Corto" | "Largo";
  teams: Schema.Types.ObjectId[];
  standings: IStandingRow[];
  topScorers: IScorerRow[];
  bestGoalkeepers: IGoalkeeperRow[];
  isActive: boolean;
}

const StandingRowSchema = new Schema<IStandingRow>(
  {
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    played: { type: Number, default: 0 },
    won: { type: Number, default: 0 },
    drawn: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    goalsDifference: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
  },
  { _id: false },
);

const ScorerRowSchema = new Schema<IScorerRow>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    goals: { type: Number, default: 0 },
  },
  { _id: false },
);

const GoalkeeperRowSchema = new Schema<IGoalkeeperRow>(
  {
    playerId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    goalsConceded: { type: Number, default: 0 },
    minutesPlayed: { type: Number, default: 0 },
  },
  { _id: false },
);

const TournamentSchema = new Schema<ITournament>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["Corto", "Largo"], required: true },
    teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    standings: [StandingRowSchema],
    topScorers: [ScorerRowSchema],
    bestGoalkeepers: [GoalkeeperRowSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Tournament = model<ITournament>("Tournament", TournamentSchema);
