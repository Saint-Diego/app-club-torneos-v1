import { Schema, model, Document } from "mongoose";

export interface IAuditLog extends Document {
  userId: Schema.Types.ObjectId;
  userEmail: string;
  userRole: string;
  action: string; // Ej: 'UPDATE_MATCH_REPORT', 'CHANGE_USER_ROLE', 'FORCE_FIXTURE_REGEN'
  resource: string; // Ej: 'Match', 'User', 'Tournament'
  resourceId: Schema.Types.ObjectId;
  payloadBefore?: any;
  payloadAfter?: any;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true },
    resourceId: { type: Schema.Types.ObjectId, required: true },
    payloadBefore: { type: Schema.Types.Mixed },
    payloadAfter: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
); // Inmutable: no permite modificaciones recurrentes

export const AuditLog = model<IAuditLog>("AuditLog", AuditLogSchema);
