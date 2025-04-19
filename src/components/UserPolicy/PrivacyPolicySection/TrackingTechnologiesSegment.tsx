import React from "react";
import { Link } from "react-router-dom";

interface TrackingTechnologiesSegmentProps {
  mainColor: string;
}

const TrackingTechnologiesSegment: React.FC<TrackingTechnologiesSegmentProps> = ({ mainColor }) => {
  return (
    <div className="py-2">
      <h3 className="text-[20px] mt-2 font-bold">
        Cookies
      </h3>
      <p className="text-lg">
        This site uses first and third-party cookies and similar technologies to process personal information for the purposes described in this Policy. Cookies are small text files placed on your device to store data that can be recalled by a web server in the same domain that placed the cookie. The text in a cookie often consists of a string of numbers and letters that uniquely identifies your device, but it can contain other information as well. To learn more about cookies and how to control the use of cookies at a browser level, visit{" "}
        <Link
          to="https://allaboutcookies.org"
          className="pr-1"
          style={{ color: mainColor, textDecoration: "underline" }}
        >
          https://allaboutcookies.org/
        </Link>
      </p>
      <h3 className="text-[20px] mt-2 font-bold">
        Do Not Track
      </h3>
      <p className="text-lg">
        Some browsers have incorporated “Do Not Track” (DNT) features that can send a signal to the websites you visit indicating you do not wish to be tracked. Because there is not a common understanding of how to interpret the DNT signal, our websites do not currently respond to browser DNT signals. However, you may still exercise your privacy rights as described elsewhere in this Policy.
      </p>
      <h3 className="text-[20px] mt-2 font-bold">
        Third party analytics tools
      </h3>
      <p className="text-lg">
        This site uses Google Analytics to analyze your interactions and experiences with our Services. You can find out how Google Analytics uses data{" "}
        <Link
          to="https://support.google.com/analytics/answer/6004245"
          className="pr-1"
          style={{ color: mainColor, textDecoration: "underline" }}
        >
          here
        </Link>{" "}
        and how to opt out of Google Analytics{" "}
        <Link
          to="https://tools.google.com/dlpage/gaoptout"
          className="pr-1"
          style={{ color: mainColor, textDecoration: "underline" }}
        >
          here
        </Link>. For more information on how Google uses data when you use our websites, click{" "}
        <Link
          to="https://policies.google.com/technologies/partner-sites"
          className="pr-1"
          style={{ color: mainColor, textDecoration: "underline" }}
        >
          here
        </Link>.
      </p>
    </div>
  );
};

export default TrackingTechnologiesSegment;
