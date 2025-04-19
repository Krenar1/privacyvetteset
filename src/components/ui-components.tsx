
import { cn } from "@/lib/utils";
import { Shield, Lock, Globe, Check, Database } from "lucide-react";
import { ReactNode } from "react";

// Section container with animation
export const Section = ({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <section id={id} className={cn("section-padding", className)}>
      {children}
    </section>
  );
};

// Container for consistent width
export const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("container-wide", className)}>
      {children}
    </div>
  );
};


export const SectionHeading = ({
  title,
  subtitle,
  content,
  centered = false,
  className,
  type
}: {
  title: string;
  subtitle?: string;
  content?: string;
  centered?: boolean;
  className?: string;
  type?: string;
}) => {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      <div className="inline-block">
        {subtitle && (
          <span 
            className={cn(
              "inline-block px-5 py-1 mb-3 text-lg font-semibold rounded-full",
              type === "secondary"
                ? "text-white bg-white/15"
                : "text-primary bg-primary/10"
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
      <h2
        className={cn(
          "text-3xl",
          type === "secondary" && "text-white",
          "md:text-4xl",
          "lg:text-5xl",
          "font-semibold",
          "mb-4",
          "text-balance"
        )}
      >
        {title}
      </h2>
      {content && (
        <p className={cn(
          "mt-2 text-left text-[17px] font-[400]",
          type === "secondary" ? "text-white" : "text-gray-600"
        )}>
          {content}
        </p>
      )}
    </div>
  );
};




// Feature card with icon
export const FeatureCard = ({
  title,
  description,
  icon,
  className,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("glass p-6 rounded-xl card-hover", className)}>
      <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary/10 text-primary rounded-lg">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-darkgray/80">{description}</p>
    </div>
  );
};

// Testimonial card
export const TestimonialCard = ({
  quote,
  author,
  company,
  className,
}: {
  quote: string;
  author: string;
  company: string;
  className?: string;
}) => {
  return (
    <div className={cn("glass p-6 rounded-xl", className)}>
      <div className="mb-4 text-primary">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 11H6C4.89543 11 4 10.1046 4 9V7C4 5.89543 4.89543 5 6 5H8C9.10457 5 10 5.89543 10 7V11ZM10 11V13C10 15.2091 8.20914 17 6 17H5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 11H16C14.8954 11 14 10.1046 14 9V7C14 5.89543 14.8954 5 16 5H18C19.1046 5 20 5.89543 20 7V11ZM20 11V13C20 15.2091 18.2091 17 16 17H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-darkgray/80 mb-4 italic">{quote}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-lightgray">{company}</p>
      </div>
    </div>
  );
};

// CTA box
export const CTABox = ({
  title,
  description,
  buttonText,
  buttonHref,
  className,
}: {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  className?: string;
}) => {
  return (
    <div className={cn("glass p-8 rounded-xl text-center", className)}>
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="mb-6 max-w-xl mx-auto">{description}</p>
      <a href={buttonHref} className="btn-primary">
        {buttonText}
      </a>
    </div>
  );
};

// Value proposition item
export const ValueItem = ({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-start mb-2">
        <div className="mr-2 mt-1">
          <Check size={18} className="text-primary" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="ml-6 text-darkgray/80">{description}</p>
    </div>
  );
};

// Brand icons
export const ShieldIcon = ({ className }: { className?: string }) => (
  <Shield className={cn("text-primary", className)} />
);

export const LockIcon = ({ className }: { className?: string }) => (
  <Lock className={cn("text-primary", className)} />
);

export const GlobeIcon = ({ className }: { className?: string }) => (
  <Globe className={cn("text-primary", className)} />
);

export const DatabaseIcon = ({ className }: { className?: string }) => (
  <Database className={cn("text-primary", className)} />
);
