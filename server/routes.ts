import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertPatientSchema, 
  insertDoctorSchema, 
  insertDrugSchema, 
  insertAppointmentSchema, 
  insertAdmissionSchema 
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Patient routes
  app.get('/api/patients', isAuthenticated, async (req, res) => {
    try {
      const patients = await storage.getPatients();
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.get('/api/patients/search', isAuthenticated, async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const patients = await storage.searchPatients(query);
      res.json(patients);
    } catch (error) {
      console.error("Error searching patients:", error);
      res.status(500).json({ message: "Failed to search patients" });
    }
  });

  app.get('/api/patients/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const patient = await storage.getPatient(id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      console.error("Error fetching patient:", error);
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });

  app.post('/api/patients', isAuthenticated, async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating patient:", error);
      res.status(500).json({ message: "Failed to create patient" });
    }
  });

  app.put('/api/patients/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const patientData = insertPatientSchema.partial().parse(req.body);
      const patient = await storage.updatePatient(id, patientData);
      res.json(patient);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating patient:", error);
      res.status(500).json({ message: "Failed to update patient" });
    }
  });

  app.delete('/api/patients/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePatient(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting patient:", error);
      res.status(500).json({ message: "Failed to delete patient" });
    }
  });

  // Doctor routes
  app.get('/api/doctors', isAuthenticated, async (req, res) => {
    try {
      const doctors = await storage.getDoctors();
      res.json(doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  app.get('/api/doctors/search', isAuthenticated, async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const doctors = await storage.searchDoctors(query);
      res.json(doctors);
    } catch (error) {
      console.error("Error searching doctors:", error);
      res.status(500).json({ message: "Failed to search doctors" });
    }
  });

  app.get('/api/doctors/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const doctor = await storage.getDoctor(id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      res.json(doctor);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      res.status(500).json({ message: "Failed to fetch doctor" });
    }
  });

  app.post('/api/doctors', isAuthenticated, async (req, res) => {
    try {
      const doctorData = insertDoctorSchema.parse(req.body);
      const doctor = await storage.createDoctor(doctorData);
      res.status(201).json(doctor);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating doctor:", error);
      res.status(500).json({ message: "Failed to create doctor" });
    }
  });

  app.put('/api/doctors/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const doctorData = insertDoctorSchema.partial().parse(req.body);
      const doctor = await storage.updateDoctor(id, doctorData);
      res.json(doctor);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating doctor:", error);
      res.status(500).json({ message: "Failed to update doctor" });
    }
  });

  app.delete('/api/doctors/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDoctor(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      res.status(500).json({ message: "Failed to delete doctor" });
    }
  });

  // Drug routes
  app.get('/api/drugs', isAuthenticated, async (req, res) => {
    try {
      const drugs = await storage.getDrugs();
      res.json(drugs);
    } catch (error) {
      console.error("Error fetching drugs:", error);
      res.status(500).json({ message: "Failed to fetch drugs" });
    }
  });

  app.get('/api/drugs/search', isAuthenticated, async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const drugs = await storage.searchDrugs(query);
      res.json(drugs);
    } catch (error) {
      console.error("Error searching drugs:", error);
      res.status(500).json({ message: "Failed to search drugs" });
    }
  });

  app.get('/api/drugs/low-stock', isAuthenticated, async (req, res) => {
    try {
      const drugs = await storage.getLowStockDrugs();
      res.json(drugs);
    } catch (error) {
      console.error("Error fetching low stock drugs:", error);
      res.status(500).json({ message: "Failed to fetch low stock drugs" });
    }
  });

  app.get('/api/drugs/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const drug = await storage.getDrug(id);
      if (!drug) {
        return res.status(404).json({ message: "Drug not found" });
      }
      res.json(drug);
    } catch (error) {
      console.error("Error fetching drug:", error);
      res.status(500).json({ message: "Failed to fetch drug" });
    }
  });

  app.post('/api/drugs', isAuthenticated, async (req, res) => {
    try {
      const drugData = insertDrugSchema.parse(req.body);
      const drug = await storage.createDrug(drugData);
      res.status(201).json(drug);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating drug:", error);
      res.status(500).json({ message: "Failed to create drug" });
    }
  });

  app.put('/api/drugs/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const drugData = insertDrugSchema.partial().parse(req.body);
      const drug = await storage.updateDrug(id, drugData);
      res.json(drug);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating drug:", error);
      res.status(500).json({ message: "Failed to update drug" });
    }
  });

  app.delete('/api/drugs/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDrug(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting drug:", error);
      res.status(500).json({ message: "Failed to delete drug" });
    }
  });

  // Appointment routes
  app.get('/api/appointments', isAuthenticated, async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get('/api/appointments/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const appointment = await storage.getAppointment(id);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      res.status(500).json({ message: "Failed to fetch appointment" });
    }
  });

  app.post('/api/appointments', isAuthenticated, async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  app.put('/api/appointments/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const appointmentData = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(id, appointmentData);
      res.json(appointment);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating appointment:", error);
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  app.delete('/api/appointments/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAppointment(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ message: "Failed to delete appointment" });
    }
  });

  // Admission routes
  app.get('/api/admissions', isAuthenticated, async (req, res) => {
    try {
      const admissions = await storage.getAdmissions();
      res.json(admissions);
    } catch (error) {
      console.error("Error fetching admissions:", error);
      res.status(500).json({ message: "Failed to fetch admissions" });
    }
  });

  app.get('/api/admissions/active', isAuthenticated, async (req, res) => {
    try {
      const admissions = await storage.getActiveAdmissions();
      res.json(admissions);
    } catch (error) {
      console.error("Error fetching active admissions:", error);
      res.status(500).json({ message: "Failed to fetch active admissions" });
    }
  });

  app.get('/api/admissions/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const admission = await storage.getAdmission(id);
      if (!admission) {
        return res.status(404).json({ message: "Admission not found" });
      }
      res.json(admission);
    } catch (error) {
      console.error("Error fetching admission:", error);
      res.status(500).json({ message: "Failed to fetch admission" });
    }
  });

  app.post('/api/admissions', isAuthenticated, async (req, res) => {
    try {
      const admissionData = insertAdmissionSchema.parse(req.body);
      const admission = await storage.createAdmission(admissionData);
      res.status(201).json(admission);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating admission:", error);
      res.status(500).json({ message: "Failed to create admission" });
    }
  });

  app.put('/api/admissions/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const admissionData = insertAdmissionSchema.partial().parse(req.body);
      const admission = await storage.updateAdmission(id, admissionData);
      res.json(admission);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating admission:", error);
      res.status(500).json({ message: "Failed to update admission" });
    }
  });

  app.delete('/api/admissions/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAdmission(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting admission:", error);
      res.status(500).json({ message: "Failed to delete admission" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
