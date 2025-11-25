import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditLog extends Document {
  admin: string;
  action: string;
  subject: string;
  details?: string;
  userId?: string;
  changes?: Record<string, any>;
  createdAt: Date;
}

const AuditLogSchema: Schema<IAuditLog> = new Schema(
  {
    admin: { type: String, required: true },
    action: { type: String, required: true },
    subject: { type: String, required: true },
    details: { type: String },
    userId: { type: String },
    changes: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
