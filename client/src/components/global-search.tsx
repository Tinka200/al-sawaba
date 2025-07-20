
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, User, UserCheck, Pill } from "lucide-react";
import { useLocation } from "wouter";

interface SearchResult {
  id: number;
  name: string;
  type: 'patient' | 'doctor' | 'drug';
  subtitle?: string;
}

async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  const results: SearchResult[] = [];
  
  // Search patients
  const patientsResponse = await fetch(`/api/patients/search?q=${encodeURIComponent(query)}`);
  if (patientsResponse.ok) {
    const patients = await patientsResponse.json();
    results.push(...patients.map((p: any) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      type: 'patient' as const,
      subtitle: p.email
    })));
  }
  
  // Search doctors
  const doctorsResponse = await fetch(`/api/doctors/search?q=${encodeURIComponent(query)}`);
  if (doctorsResponse.ok) {
    const doctors = await doctorsResponse.json();
    results.push(...doctors.map((d: any) => ({
      id: d.id,
      name: `Dr. ${d.firstName} ${d.lastName}`,
      type: 'doctor' as const,
      subtitle: d.specialization
    })));
  }
  
  // Search drugs
  const drugsResponse = await fetch(`/api/drugs/search?q=${encodeURIComponent(query)}`);
  if (drugsResponse.ok) {
    const drugs = await drugsResponse.json();
    results.push(...drugs.map((d: any) => ({
      id: d.id,
      name: d.name,
      type: 'drug' as const,
      subtitle: d.category
    })));
  }
  
  return results;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['global-search', query],
    queryFn: () => globalSearch(query),
    enabled: query.length > 2,
  });
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'patient': return <User className="h-4 w-4" />;
      case 'doctor': return <UserCheck className="h-4 w-4" />;
      case 'drug': return <Pill className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };
  
  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    const routes = {
      patient: '/patients',
      doctor: '/doctors', 
      drug: '/drugs'
    };
    setLocation(`${routes[result.type]}?id=${result.id}`);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2">
          <Search className="h-4 w-4 xl:mr-2" />
          <span className="hidden xl:inline-flex">Search...</span>
          <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <Command>
          <CommandInput 
            placeholder="Search patients, doctors, drugs..." 
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Searching..." : "No results found."}
            </CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading="Results">
                {results.map((result) => (
                  <CommandItem
                    key={`${result.type}-${result.id}`}
                    onSelect={() => handleSelect(result)}
                    className="flex items-center gap-2"
                  >
                    {getIcon(result.type)}
                    <div className="flex flex-col">
                      <span>{result.name}</span>
                      {result.subtitle && (
                        <span className="text-xs text-muted-foreground">
                          {result.subtitle}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
