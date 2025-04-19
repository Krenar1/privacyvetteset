import React from "react";
import { Section, Container, SectionHeading } from "./ui-components";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
}

const testimonials: Testimonial[] = [
    {
      name: "Sarah Bennett",
      role: "Head of Legal",
      company: "PetCare Online",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&auto=format",
      quote:
        "PrivacyVet turned our 30‑page privacy nightmare into an elegant, fully compliant policy in minutes. We've passed every audit since.",
    },
    {
      name: "Marcus Liang",
      role: "CTO",
      company: "ShopVerse",
      avatar:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=128&h=128&fit=crop&auto=format",   // ⬅️ new avatar
      quote:
        "The automatic updates alone justify the price. Whenever a regulation changes, our site stays compliant without a single line of code.",
    },
    {
      name: "Daniela Rossi",
      role: "Founder",
      company: "TravelLite",
      avatar:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=128&h=128&fit=crop&auto=format",
      quote:
        "Cookie banners used to scare me. PrivacyVet’s consent manager integrated in under five minutes and our bounce rate actually dropped.",
    },
    {
      name: "Carlos Jiménez",
      role: "Data Protection Officer",
      company: "FinServe EU",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&fit=crop&auto=format",
      quote:
        "We operate across 20+ jurisdictions. PrivacyVet is the only tool that keeps up with the patchwork of global privacy laws—flawlessly.",
    },
    {
      name: "Linda Chu",
      role: "Product Manager",
      company: "HealthStart",
      avatar:
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=128&h=128&fit=crop&auto=format",
      quote:
        "HIPAA compliance was a blocker for our launch. PrivacyVet’s HIPAA notice generator passed internal and external review the same week.",
    },
    {
      name: "Oliver Grayson",
      role: "Growth Lead",
      company: "BrightAds",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=128&h=128&fit=crop&auto=format",
      quote:
        "Our marketing stack collects data everywhere. PrivacyVet gave us clear data‑processing agreements for every vendor—huge time‑saver.",
    },
  ];
  

const Testimonials = () => (
  <Section id="testimonials" className="bg-white relative">
    {/* subtle background accents */}
    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full -z-[1]" />
    <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full -z-[1]" />

    <Container>
      <SectionHeading
        subtitle="Testimonials"
        title="What Customers Say About PrivacyVet"
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="animate-fade-in rounded-2xl bg-white shadow-xl p-6 flex flex-col h-full"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-gray-500">
                  {t.role}, {t.company}
                </p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed flex-1">
              “{t.quote}”
            </p>
          </div>
        ))}
      </div>
    </Container>
  </Section>
);

export default Testimonials;
