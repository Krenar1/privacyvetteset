import { Section, Container, SectionHeading } from "./ui-components";
import { Link } from "react-router-dom"; 

const BookADemo = () => {
  return (
    <Section id="book-a-demo" className="mt-10 relative">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full z-10" />
      
      <div className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-primary/5 z-10 animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[15%] w-40 h-40 rounded-full bg-primary/5 z-10 animate-pulse-slow" style={{ animationDelay: "1s" }} />
      <Container className="bg-[white] px-15 py-5 rounded-[30px] relative">
        <SectionHeading 
          subtitle="Book a Demo"
          title="Experience Our Platform in Action"
          centered
        />
        <div className="flex flex-col items-center mt-8">
          <img 
            src="https://cdn.dribbble.com/userupload/42329428/file/original-060b5ae1efdffd8a95e8dd008d70d52a.gif" 
            alt="Animated Demo Preview" 
            className="w-full max-w-[600px] mb-6" 
          />
          <p className="text-center text-[18px] text-[black] mb-6">
            Interested in seeing how our platform can benefit your business? Schedule a free demo with us to experience a personalized walkthrough.
          </p>
          <Link to="/schedule" className="bg-primary text-white py-3 px-6 rounded-md font-semibold hover:bg-primary/90">
              Schedule a Demo
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default BookADemo;
