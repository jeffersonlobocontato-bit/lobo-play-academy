import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CoursesSection from '@/components/landing/CoursesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import LeadMagnetSection from '@/components/landing/LeadMagnetSection';
import ContactSection from '@/components/landing/ContactSection';
import CTASection from '@/components/landing/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CoursesSection />
        <TestimonialsSection />
        <LeadMagnetSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
