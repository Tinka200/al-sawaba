import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: "dashboard" },
    { name: "Patients", href: "/patients", icon: "users" },
    { name: "Doctors", href: "/doctors", icon: "stethoscope" },
    { name: "Drugs", href: "/drugs", icon: "pills" },
    { name: "Appointments", href: "/appointments", icon: "calendar" },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[hsl(207,90%,54%)] rounded-full flex items-center justify-center">
              <Heart className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[hsl(207,90%,54%)]">Al-sawab Clinic</h1>
              <p className="text-sm text-[hsl(215,16%,47%)]">& Maternity</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors ${
                    location === item.href
                      ? "text-[hsl(207,90%,54%)] font-medium"
                      : "text-gray-700 hover:text-[hsl(207,90%,54%)]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.firstName || user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/api/logout")}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => (window.location.href = "/api/login")}
                className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
              >
                Login
              </Button>
            )}

            {/* Mobile Menu Button */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md transition-colors ${
                    location === item.href
                      ? "text-[hsl(207,90%,54%)] bg-blue-50 font-medium"
                      : "text-gray-700 hover:text-[hsl(207,90%,54%)] hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
