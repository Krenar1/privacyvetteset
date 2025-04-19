import React, { useEffect } from "react";
import { InlineWidget } from "react-calendly";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const DemoSchedule = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <div
        className={cn("p-4 mt-10 flex md:flex-row-reverse flex-col gap-4 items-center justify-center min-h-[100vh] relative")}
        style={{ background: "white" }}
      >
        {/* GIF banner on top */}
        <div className="flex flex-col justify-center items-center my-2">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-2 mt-20 text-black">
            Schedule a Meeting
          </h2>
          <img
            src="https://cdn.dribbble.com/userupload/42329428/file/original-060b5ae1efdffd8a95e8dd008d70d52a.gif"
            alt="Meeting Schedule Gif"
            className="w-full max-w-full md:max-w-[720px] mt-[50px] md:mt-0 h-auto"
          />
        </div>
        <div className="max-w-[600px] w-full border">
          {/* Calendly Inline Widget with Dark Mode parameters */}
          {/* <InlineWidget url="https://calendly.com/gentrit-asaasin?background_color=2D7EB0&text_color=ffffff&primary_color=fff" /> */}
<InlineWidget url="https://calendly.com/gentrit-asaasin" />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DemoSchedule;
