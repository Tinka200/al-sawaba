import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Bed, Stethoscope, PillBottle, Calendar, AlertTriangle, Plus, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ["/api/patients"],
    retry: false,
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ["/api/appointments"],
    retry: false,
  });

  const { data: lowStockDrugs, isLoading: drugsLoading } = useQuery({
    queryKey: ["/api/drugs/low-stock"],
    retry: false,
  });

  const { data: activeAdmissions, isLoading: admissionsLoading } = useQuery({
    queryKey: ["/api/admissions/active"],
    retry: false,
  });

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const recentPatients = patients?.slice(0, 5) || [];
  const recentAppointments = appointments?.slice(0, 5) || [];
  const recentAdmissions = activeAdmissions?.slice(0, 5) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hospital Dashboard</h1>
          <p className="text-gray-600">Welcome to Al-sawab Clinic & Maternity Management System</p>
        </div>
        <div className="flex space-x-4">
          <Link href="/patients">
            <Button className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]">
              <Plus className="mr-2" size={16} />
              Add Patient
            </Button>
          </Link>
          <Link href="/appointments">
            <Button variant="outline">
              <Calendar className="mr-2" size={16} />
              New Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Patients</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.totalPatients || 0}</p>
              </div>
              <div className="w-12 h-12 bg-[hsl(159,84%,37%)] rounded-full flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Admissions</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.activeAdmissions || 0}</p>
              </div>
              <div className="w-12 h-12 bg-[hsl(207,90%,54%)] rounded-full flex items-center justify-center">
                <Bed className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Doctors Available</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.doctorsAvailable || 0}</p>
              </div>
              <div className="w-12 h-12 bg-[hsl(189,84%,54%)] rounded-full flex items-center justify-center">
                <Stethoscope className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Drug Items</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.drugItems || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <PillBottle className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Patients */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Patients</span>
              <Link href="/patients">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patientsLoading ? (
              <div className="text-center py-4">Loading patients...</div>
            ) : recentPatients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No patients registered yet
              </div>
            ) : (
              <div className="space-y-4">
                {recentPatients.map((patient: any) => (
                  <div key={patient.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-[hsl(207,90%,54%)] rounded-full flex items-center justify-center">
                      <Users className="text-white" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {patient.gender || "N/A"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Appointments</span>
              <Link href="/appointments">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <div className="text-center py-4">Loading appointments...</div>
            ) : recentAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled yet
              </div>
            ) : (
              <div className="space-y-4">
                {recentAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-[hsl(159,84%,37%)] rounded-full flex items-center justify-center">
                      <Calendar className="text-white" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </p>
                      <Badge 
                        variant={appointment.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Admissions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Admissions</span>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {admissionsLoading ? (
              <div className="text-center py-4">Loading admissions...</div>
            ) : recentAdmissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No active admissions
              </div>
            ) : (
              <div className="space-y-4">
                {recentAdmissions.map((admission: any) => (
                  <div key={admission.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 bg-[hsl(189,84%,54%)] rounded-full flex items-center justify-center">
                      <Bed className="text-white" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {admission.patient?.firstName} {admission.patient?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Room {admission.roomNumber} - Bed {admission.bedNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(admission.admissionDate).toLocaleDateString()}
                      </p>
                      <Badge variant="default" className="text-xs bg-green-500">
                        {admission.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Drugs */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-red-600">
              <span className="flex items-center">
                <AlertTriangle className="mr-2" size={20} />
                Low Stock Drugs
              </span>
              <Link href="/drugs">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {drugsLoading ? (
              <div className="text-center py-4">Loading drugs...</div>
            ) : !lowStockDrugs || lowStockDrugs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                All drugs are well stocked
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockDrugs.map((drug: any) => (
                  <div key={drug.id} className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <PillBottle className="text-white" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{drug.name}</p>
                      <p className="text-sm text-gray-600">{drug.dosage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        Stock: {drug.stockQuantity} {drug.unit}
                      </p>
                      <p className="text-xs text-gray-500">
                        Exp: {new Date(drug.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
