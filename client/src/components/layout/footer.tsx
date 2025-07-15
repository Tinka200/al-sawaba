import { Heart, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-[hsl(207,90%,54%)] rounded-full flex items-center justify-center">
                <Heart className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Al-sawab Clinic</h3>
                <p className="text-sm text-gray-400">& Maternity</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Professional healthcare services with compassion and excellence.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-[hsl(207,90%,54%)] cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-[hsl(207,90%,54%)] cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-[hsl(207,90%,54%)] cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-[hsl(207,90%,54%)] cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Patients</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Doctors</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Appointments</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Drugs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Maternity Care</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cardiology</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">General Medicine</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Emergency Care</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Laboratory</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <div className="space-y-3">
              <p className="text-gray-400">
                <i className="fas fa-map-marker-alt mr-2"></i>
                123 Medical District, Downtown Area
              </p>
              <p className="text-gray-400">
                <i className="fas fa-phone mr-2"></i>
                (555) 123-4567
              </p>
              <p className="text-gray-400">
                <i className="fas fa-envelope mr-2"></i>
                info@alsawabclinic.com
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2023 Al-sawab Clinic & Maternity. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
