import {
  users,
  patients,
  doctors,
  drugs,
  appointments,
  admissions,
  type User,
  type UpsertUser,
  type Patient,
  type InsertPatient,
  type Doctor,
  type InsertDoctor,
  type Drug,
  type InsertDrug,
  type Appointment,
  type InsertAppointment,
  type Admission,
  type InsertAdmission,
  type PatientWithUser,
  type DoctorWithUser,
  type AppointmentWithDetails,
  type AdmissionWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, like, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Patient operations
  getPatients(): Promise<PatientWithUser[]>;
  getPatient(id: number): Promise<PatientWithUser | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient>;
  deletePatient(id: number): Promise<void>;
  searchPatients(query: string): Promise<PatientWithUser[]>;
  
  // Doctor operations
  getDoctors(): Promise<DoctorWithUser[]>;
  getDoctor(id: number): Promise<DoctorWithUser | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  updateDoctor(id: number, doctor: Partial<InsertDoctor>): Promise<Doctor>;
  deleteDoctor(id: number): Promise<void>;
  searchDoctors(query: string): Promise<DoctorWithUser[]>;
  
  // Drug operations
  getDrugs(): Promise<Drug[]>;
  getDrug(id: number): Promise<Drug | undefined>;
  createDrug(drug: InsertDrug): Promise<Drug>;
  updateDrug(id: number, drug: Partial<InsertDrug>): Promise<Drug>;
  deleteDrug(id: number): Promise<void>;
  searchDrugs(query: string): Promise<Drug[]>;
  getLowStockDrugs(): Promise<Drug[]>;
  
  // Appointment operations
  getAppointments(): Promise<AppointmentWithDetails[]>;
  getAppointment(id: number): Promise<AppointmentWithDetails | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: number): Promise<void>;
  getAppointmentsByDoctor(doctorId: number): Promise<AppointmentWithDetails[]>;
  getAppointmentsByPatient(patientId: number): Promise<AppointmentWithDetails[]>;
  
  // Admission operations
  getAdmissions(): Promise<AdmissionWithDetails[]>;
  getAdmission(id: number): Promise<AdmissionWithDetails | undefined>;
  createAdmission(admission: InsertAdmission): Promise<Admission>;
  updateAdmission(id: number, admission: Partial<InsertAdmission>): Promise<Admission>;
  deleteAdmission(id: number): Promise<void>;
  getActiveAdmissions(): Promise<AdmissionWithDetails[]>;
  
  // Dashboard statistics
  getDashboardStats(): Promise<{
    totalPatients: number;
    activeAdmissions: number;
    doctorsAvailable: number;
    drugItems: number;
    appointmentsToday: number;
    lowStockDrugs: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Patient operations
  async getPatients(): Promise<PatientWithUser[]> {
    const results = await db
      .select()
      .from(patients)
      .leftJoin(users, eq(patients.userId, users.id))
      .orderBy(desc(patients.createdAt));
    
    return results.map(row => ({
      ...row.patients,
      user: row.users
    }));
  }

  async getPatient(id: number): Promise<PatientWithUser | undefined> {
    const [result] = await db
      .select()
      .from(patients)
      .leftJoin(users, eq(patients.userId, users.id))
      .where(eq(patients.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.patients,
      user: result.users
    };
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [newPatient] = await db.insert(patients).values(patient).returning();
    return newPatient;
  }

  async updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient> {
    const [updatedPatient] = await db
      .update(patients)
      .set({ ...patient, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return updatedPatient;
  }

  async deletePatient(id: number): Promise<void> {
    await db.delete(patients).where(eq(patients.id, id));
  }

  async searchPatients(query: string): Promise<PatientWithUser[]> {
    const results = await db
      .select()
      .from(patients)
      .leftJoin(users, eq(patients.userId, users.id))
      .where(
        or(
          like(patients.firstName, `%${query}%`),
          like(patients.lastName, `%${query}%`),
          like(patients.email, `%${query}%`),
          like(patients.phone, `%${query}%`)
        )
      )
      .orderBy(desc(patients.createdAt));
      
    return results.map(row => ({
      ...row.patients,
      user: row.users
    }));
  }

  // Doctor operations
  async getDoctors(): Promise<DoctorWithUser[]> {
    const results = await db
      .select()
      .from(doctors)
      .leftJoin(users, eq(doctors.userId, users.id))
      .orderBy(desc(doctors.createdAt));
      
    return results.map(row => ({
      ...row.doctors,
      user: row.users
    }));
  }

  async getDoctor(id: number): Promise<DoctorWithUser | undefined> {
    const [result] = await db
      .select()
      .from(doctors)
      .leftJoin(users, eq(doctors.userId, users.id))
      .where(eq(doctors.id, id));
      
    if (!result) return undefined;
    
    return {
      ...result.doctors,
      user: result.users
    };
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const [newDoctor] = await db.insert(doctors).values(doctor).returning();
    return newDoctor;
  }

  async updateDoctor(id: number, doctor: Partial<InsertDoctor>): Promise<Doctor> {
    const [updatedDoctor] = await db
      .update(doctors)
      .set({ ...doctor, updatedAt: new Date() })
      .where(eq(doctors.id, id))
      .returning();
    return updatedDoctor;
  }

  async deleteDoctor(id: number): Promise<void> {
    await db.delete(doctors).where(eq(doctors.id, id));
  }

  async searchDoctors(query: string): Promise<DoctorWithUser[]> {
    const results = await db
      .select()
      .from(doctors)
      .leftJoin(users, eq(doctors.userId, users.id))
      .where(
        or(
          like(doctors.firstName, `%${query}%`),
          like(doctors.lastName, `%${query}%`),
          like(doctors.specialization, `%${query}%`),
          like(doctors.email, `%${query}%`)
        )
      )
      .orderBy(desc(doctors.createdAt));
      
    return results.map(row => ({
      ...row.doctors,
      user: row.users
    }));
  }

  // Drug operations
  async getDrugs(): Promise<Drug[]> {
    return await db.select().from(drugs).orderBy(desc(drugs.createdAt));
  }

  async getDrug(id: number): Promise<Drug | undefined> {
    const [drug] = await db.select().from(drugs).where(eq(drugs.id, id));
    return drug;
  }

  async createDrug(drug: InsertDrug): Promise<Drug> {
    const [newDrug] = await db.insert(drugs).values(drug).returning();
    return newDrug;
  }

  async updateDrug(id: number, drug: Partial<InsertDrug>): Promise<Drug> {
    const [updatedDrug] = await db
      .update(drugs)
      .set({ ...drug, updatedAt: new Date() })
      .where(eq(drugs.id, id))
      .returning();
    return updatedDrug;
  }

  async deleteDrug(id: number): Promise<void> {
    await db.delete(drugs).where(eq(drugs.id, id));
  }

  async searchDrugs(query: string): Promise<Drug[]> {
    return await db
      .select()
      .from(drugs)
      .where(
        or(
          like(drugs.name, `%${query}%`),
          like(drugs.category, `%${query}%`),
          like(drugs.manufacturer, `%${query}%`)
        )
      )
      .orderBy(desc(drugs.createdAt));
  }

  async getLowStockDrugs(): Promise<Drug[]> {
    return await db
      .select()
      .from(drugs)
      .where(sql`${drugs.stockQuantity} <= 10`)
      .orderBy(drugs.stockQuantity);
  }

  // Appointment operations
  async getAppointments(): Promise<AppointmentWithDetails[]> {
    const results = await db
      .select()
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
      .orderBy(desc(appointments.appointmentDate));
      
    return results.map(row => ({
      ...row.appointments,
      patient: row.patients,
      doctor: row.doctors
    }));
  }

  async getAppointment(id: number): Promise<AppointmentWithDetails | undefined> {
    const [result] = await db
      .select()
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
      .where(eq(appointments.id, id));
      
    if (!result) return undefined;
    
    return {
      ...result.appointments,
      patient: result.patients,
      doctor: result.doctors
    };
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ ...appointment, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
  }

  async getAppointmentsByDoctor(doctorId: number): Promise<AppointmentWithDetails[]> {
    const results = await db
      .select()
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
      .where(eq(appointments.doctorId, doctorId))
      .orderBy(desc(appointments.appointmentDate));
      
    return results.map(row => ({
      ...row.appointments,
      patient: row.patients,
      doctor: row.doctors
    }));
  }

  async getAppointmentsByPatient(patientId: number): Promise<AppointmentWithDetails[]> {
    const results = await db
      .select()
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
      .where(eq(appointments.patientId, patientId))
      .orderBy(desc(appointments.appointmentDate));
      
    return results.map(row => ({
      ...row.appointments,
      patient: row.patients,
      doctor: row.doctors
    }));
  }

  // Admission operations
  async getAdmissions(): Promise<AdmissionWithDetails[]> {
    const results = await db
      .select()
      .from(admissions)
      .leftJoin(patients, eq(admissions.patientId, patients.id))
      .leftJoin(doctors, eq(admissions.doctorId, doctors.id))
      .orderBy(desc(admissions.admissionDate));
      
    return results.map(row => ({
      ...row.admissions,
      patient: row.patients,
      doctor: row.doctors
    }));
  }

  async getAdmission(id: number): Promise<AdmissionWithDetails | undefined> {
    const [result] = await db
      .select()
      .from(admissions)
      .leftJoin(patients, eq(admissions.patientId, patients.id))
      .leftJoin(doctors, eq(admissions.doctorId, doctors.id))
      .where(eq(admissions.id, id));
      
    if (!result) return undefined;
    
    return {
      ...result.admissions,
      patient: result.patients,
      doctor: result.doctors
    };
  }

  async createAdmission(admission: InsertAdmission): Promise<Admission> {
    const [newAdmission] = await db.insert(admissions).values(admission).returning();
    return newAdmission;
  }

  async updateAdmission(id: number, admission: Partial<InsertAdmission>): Promise<Admission> {
    const [updatedAdmission] = await db
      .update(admissions)
      .set({ ...admission, updatedAt: new Date() })
      .where(eq(admissions.id, id))
      .returning();
    return updatedAdmission;
  }

  async deleteAdmission(id: number): Promise<void> {
    await db.delete(admissions).where(eq(admissions.id, id));
  }

  async getActiveAdmissions(): Promise<AdmissionWithDetails[]> {
    const results = await db
      .select()
      .from(admissions)
      .leftJoin(patients, eq(admissions.patientId, patients.id))
      .leftJoin(doctors, eq(admissions.doctorId, doctors.id))
      .where(eq(admissions.status, "admitted"))
      .orderBy(desc(admissions.admissionDate));
      
    return results.map(row => ({
      ...row.admissions,
      patient: row.patients,
      doctor: row.doctors
    }));
  }

  // Dashboard statistics
  async getDashboardStats() {
    const [totalPatients] = await db.select({ count: sql<number>`count(*)` }).from(patients);
    const [activeAdmissions] = await db.select({ count: sql<number>`count(*)` }).from(admissions).where(eq(admissions.status, "admitted"));
    const [doctorsAvailable] = await db.select({ count: sql<number>`count(*)` }).from(doctors).where(eq(doctors.isActive, true));
    const [drugItems] = await db.select({ count: sql<number>`count(*)` }).from(drugs);
    const [appointmentsToday] = await db.select({ count: sql<number>`count(*)` }).from(appointments).where(eq(appointments.appointmentDate, new Date().toISOString().split('T')[0]));
    const [lowStockDrugs] = await db.select({ count: sql<number>`count(*)` }).from(drugs).where(sql`${drugs.stockQuantity} <= 10`);

    return {
      totalPatients: totalPatients.count,
      activeAdmissions: activeAdmissions.count,
      doctorsAvailable: doctorsAvailable.count,
      drugItems: drugItems.count,
      appointmentsToday: appointmentsToday.count,
      lowStockDrugs: lowStockDrugs.count,
    };
  }
}

export const storage = new DatabaseStorage();
