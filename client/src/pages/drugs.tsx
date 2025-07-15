import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, PillBottle, AlertTriangle, Calendar, Package } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import DrugForm from "@/components/forms/drug-form";

export default function Drugs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: drugs, isLoading } = useQuery({
    queryKey: searchQuery ? ["/api/drugs/search", { q: searchQuery }] : ["/api/drugs"],
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/drugs/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Drug deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/drugs"] });
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
        description: "Failed to delete drug",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the query key change
  };

  const handleEdit = (drug: any) => {
    setSelectedDrug(drug);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this drug?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedDrug(null);
  };

  const isLowStock = (quantity: number) => quantity <= 10;
  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Drug Inventory</h1>
          <p className="text-gray-600">Manage drug stock and inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
              onClick={() => setSelectedDrug(null)}
            >
              <Plus className="mr-2" size={16} />
              Add Drug
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedDrug ? "Edit Drug" : "Add New Drug"}
              </DialogTitle>
            </DialogHeader>
            <DrugForm
              drug={selectedDrug}
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
                placeholder="Search drugs by name, category, or manufacturer..."
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

      {/* Drugs List */}
      <Card>
        <CardHeader>
          <CardTitle>Drugs ({drugs?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading drugs...</div>
          ) : !drugs || drugs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "No drugs found matching your search" : "No drugs in inventory yet"}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drugs.map((drug: any) => (
                <Card 
                  key={drug.id} 
                  className={`hover:shadow-lg transition-shadow ${
                    isLowStock(drug.stockQuantity) ? 'border-red-200 bg-red-50' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <PillBottle className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {drug.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {drug.dosage} {drug.unit}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Stock:</span>
                        <span className={`font-medium ${
                          isLowStock(drug.stockQuantity) ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {drug.stockQuantity} {drug.unit}
                        </span>
                      </div>
                      
                      {drug.category && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Category:</span>
                          <Badge variant="outline">{drug.category}</Badge>
                        </div>
                      )}
                      
                      {drug.manufacturer && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Manufacturer:</span>
                          <span className="text-sm text-gray-800">{drug.manufacturer}</span>
                        </div>
                      )}
                      
                      {drug.expiryDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Expiry:</span>
                          <span className={`text-sm flex items-center ${
                            isExpiringSoon(drug.expiryDate) ? 'text-red-600' : 'text-gray-800'
                          }`}>
                            <Calendar className="mr-1" size={12} />
                            {new Date(drug.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Alerts */}
                    <div className="mb-4">
                      {isLowStock(drug.stockQuantity) && (
                        <div className="flex items-center text-red-600 text-sm mb-2">
                          <AlertTriangle className="mr-1" size={14} />
                          Low Stock Alert
                        </div>
                      )}
                      {drug.expiryDate && isExpiringSoon(drug.expiryDate) && (
                        <div className="flex items-center text-amber-600 text-sm mb-2">
                          <AlertTriangle className="mr-1" size={14} />
                          Expiring Soon
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(drug)}
                        className="flex-1"
                      >
                        <Edit className="mr-1" size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(drug.id)}
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
