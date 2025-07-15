import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Stethoscope, Mail, Phone, Star, GraduationCap } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import DoctorForm from "@/components/forms/doctor-form";

export default function Doctors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: doctors, isLoading } = useQuery({
    queryKey: searchQuery ? ["/api/doctors/search", { q: searchQuery }] : ["/api/doctors"],
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/doctors/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Doctor deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/doctors"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to delete doctor",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the query key change
  };

  const handleEdit = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this doctor?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Doctor Management</h1>
          <p className="text-gray-600">Manage doctor profiles and information</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
              onClick={() => setSelectedDoctor(null)}
            >
              <Plus className="mr-2" size={16} />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedDoctor ? "Edit Doctor" : "Add New Doctor"}
              </DialogTitle>
            </DialogHeader>
            <DoctorForm
              doctor={selectedDoctor}
              onSuccess={handleDialogClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search doctors by name, specialization, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Doctors List */}
      <Card>
        <CardHeader>
          <CardTitle>Doctors ({doctors?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading doctors...</div>
          ) : !doctors || doctors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "No doctors found matching your search" : "No doctors registered yet"}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor: any) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-[hsl(189,84%,54%)] rounded-full flex items-center justify-center">
                        <Stethoscope className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-sm text-[hsl(207,90%,54%)]">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {doctor.email && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="mr-2" size={14} />
                          {doctor.email}
                        </p>
                      )}
                      {doctor.phone && (
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="mr-2" size={14} />
                          {doctor.phone}
                        </p>
                      )}
                      {doctor.experience && (
                        <p className="text-sm text-gray-600">
                          {doctor.experience} years experience
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      {doctor.qualification && (
                        <Badge variant="outline" className="flex items-center">
                          <GraduationCap className="mr-1" size={12} />
                          {doctor.qualification}
                        </Badge>
                      )}
                      {doctor.rating && (
                        <Badge variant="secondary" className="flex items-center">
                          <Star className="mr-1" size={12} />
                          {doctor.rating}/5
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(doctor)}
                        className="flex-1"
                      >
                        <Edit className="mr-1" size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(doctor.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
