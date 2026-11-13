import {
  Entity,
  PrimaryColumn,
  Column,
  Check,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("app_system")
@Check("CHK_app_system_singleton", '"id" = 1')
export class AppSystem {
  @PrimaryColumn({ type: "int", default: 1 })
  id: number;

  // General
  @Column({ type: "varchar", length: 100, default: "My App" })
  appName: string;

  @Column({ type: "varchar", nullable: true })
  supportEmail: string | null;

  @Column({ type: "varchar", length: 10, default: "en" })
  defaultLanguage: string;

  @Column({ type: "varchar", length: 64, default: "UTC" })
  defaultTimezone: string;

  // Access
  @Column({ type: "boolean", default: true })
  registrationEnabled: boolean;

  @Column({ type: "boolean", default: true })
  emailVerificationRequired: boolean;

  // Maintenance
  @Column({ type: "boolean", default: false })
  maintenanceMode: boolean;

  @Column({ type: "text", nullable: true })
  maintenanceMessage: string | null;

  // Uploads
  @Column({ type: "int", default: 5 })
  maxUploadSizeMb: number;

  @Column({
    type: "jsonb",
    default: () => '\'["image/jpeg","image/png","application/pdf"]\'',
  })
  allowedFileTypes: string[];

  // Anything that doesn't deserve its own column yet (feature flags, etc.)
  @Column({ type: "jsonb", default: () => "'{}'" })
  extra: Record<string, unknown>;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
