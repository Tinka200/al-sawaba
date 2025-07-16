import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Baby, Users, Calendar, Shield, Clock, MapPin, Phone, Mail } from "lucide-react";

export default function Landing() {
  const services = [
    {
      icon: Baby,
      title: "Maternity Care",
      description: "Complete prenatal, delivery, and postnatal care with experienced obstetricians and modern facilities.",
      color: "bg-[hsl(159,84%,37%)]"
    },
    {
      icon: Heart,
      title: "Cardiology",
      description: "Advanced cardiac care including diagnostics, treatment, and preventive cardiology services.",
      color: "bg-[hsl(207,90%,54%)]"
    },
    {
      icon: Users,
      title: "General Medicine",
      description: "Comprehensive primary care services for patients of all ages with experienced physicians.",
      color: "bg-[hsl(189,84%,54%)]"
    },
    {
      icon: Shield,
      title: "Emergency Care",
      description: "24/7 emergency services with fully equipped trauma center and experienced emergency physicians.",
      color: "bg-red-500"
    },
    {
      icon: Calendar,
      title: "Preventive Care",
      description: "Regular health screenings and preventive care to maintain optimal health and wellness.",
      color: "bg-purple-500"
    },
    {
      icon: Clock,
      title: "24/7 Services",
      description: "Round-the-clock medical care for emergencies and critical patient monitoring.",
      color: "bg-amber-500"
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="medical-gradient text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Professional Healthcare Services
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Providing comprehensive medical care with compassion and excellence. 
                Your health is our priority at Al-sawab Clinic & Maternity.
              </p>
              <div className="bg-blue-900/30 border border-blue-300/30 rounded-lg p-4 mb-6">
                <p className="text-blue-100 text-lg font-medium">
                  🔐 Please log in to access patient management, appointments, and medical records
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  size="lg"
                  className="bg-white text-[hsl(207,90%,54%)] hover:bg-gray-100"
                  onClick={() => (window.location.href = "/api/login")}
                >
                  <Calendar className="mr-2" size={20} />
                  Access Patient Portal
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[hsl(207,90%,54%)]"
                  onClick={() => window.open('https://wa.me/2348130120622', '_blank')}
                >
                  <Phone className="mr-2" size={20} />
                  WhatsApp: +234 813 012 0622
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <Heart className="text-white" size={40} />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Al-sawab Clinic</h3>
                  <p className="text-blue-100 mb-4">& Maternity</p>
                  <p className="text-sm text-blue-100">
                    Serving the community for over 20 years with excellence in healthcare
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Medical Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare solutions with state-of-the-art facilities and experienced medical professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mb-6`}>
                    <service.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-[hsl(207,90%,54%)] hover:text-[hsl(189,84%,54%)]"
                  >
                    Learn More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                About Al-sawab Clinic & Maternity
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                For over two decades, Al-sawab Clinic & Maternity has been serving the community 
                with excellence in healthcare. We combine traditional values of compassionate care 
                with modern medical technology to provide comprehensive health services.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[hsl(159,84%,37%)] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">State-of-the-art medical equipment and facilities</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[hsl(159,84%,37%)] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">24/7 emergency care and maternity services</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[hsl(159,84%,37%)] rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-gray-700">Experienced medical professionals and specialists</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[hsl(207,90%,54%)] mb-2">20+</p>
                  <p className="text-gray-600">Years of Service</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[hsl(207,90%,54%)] mb-2">10,000+</p>
                  <p className="text-gray-600">Happy Patients</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="p-8 shadow-xl">
                <div className="text-center">
                  <div className="w-20 h-20 bg-[hsl(207,90%,54%)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
                  <p className="text-gray-600 mb-6">
                    To provide exceptional healthcare services that enhance the quality of life 
                    for our patients and their families through compassionate care, medical excellence, 
                    and innovative treatment approaches.
                  </p>
                  <Button
                    className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
                    onClick={() => (window.location.href = "/api/login")}
                  >
                    Join Our Community
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get in touch with us for appointments, inquiries, or emergency services.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="p-6 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[hsl(207,90%,54%)] rounded-full flex items-center justify-center">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Address</h3>
                  <p className="text-gray-600">
                    123 Medical District, Downtown Area<br />
                    City, State 12345
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[hsl(159,84%,37%)] rounded-full flex items-center justify-center">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone</h3>
                  <p className="text-gray-600">
                    <a href="tel:+2348130120622" className="hover:text-[hsl(207,90%,54%)]">
                      +234 813 012 0622
                    </a><br />
                    <a 
                      href="https://wa.me/2348130120622" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-[hsl(159,84%,37%)]"
                    >
                      WhatsApp: +234 813 012 0622
                    </a>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[hsl(189,84%,54%)] rounded-full flex items-center justify-center">
                  <Mail className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
                  <p className="text-gray-600">
                    info@alsawabclinic.com<br />
                    emergency@alsawabclinic.com
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
