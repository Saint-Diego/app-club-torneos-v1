import { AuditLog } from "../models/auditLog.model";
import { Types } from "mongoose";

interface LogParams {
  userId: string;
  userEmail: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  payloadBefore?: any;
  payloadAfter?: any;
  ipAddress?: string;
}

export class AuditService {
  public static logAction(params: LogParams): void {
    // Ejecución en segundo plano para optimizar rendimiento de la API
    AuditLog.create({
      userId: new Types.ObjectId(params.userId),
      userEmail: params.userEmail,
      userRole: params.userRole,
      action: params.action,
      resource: params.resource,
      resourceId: new Types.ObjectId(params.resourceId),
      payloadBefore: params.payloadBefore,
      payloadAfter: params.payloadAfter,
      ipAddress: params.ipAddress,
    }).catch((err) =>
      console.error("Fallo crítico al escribir en log de auditoría:", err),
    );
  }
}
