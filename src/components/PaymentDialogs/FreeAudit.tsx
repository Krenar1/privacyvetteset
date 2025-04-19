import { useState } from "react";
import { DialogDescription, DialogTitle } from "../ui/dialog";
import { formDataType } from "../Pricing";

const FreeAudit = ({subscribed}: {subscribed: boolean}) => {


  return (
    <div className="text-center space-y-3">
      {!subscribed ? (
        <>
          <DialogTitle className="text-xl font-semibold text-primary">
            🎉 You're Subscribed to Our Free Privacy Audit!
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Thank you for signing up for our <span className="font-medium">Free Privacy Audit</span>.  
            Our team will review your privacy policies and provide insights to help you stay compliant.  
            You’ll receive an email with the next steps shortly.
          </DialogDescription>
          {/* <button
            onClick={() => setSubscribed(true)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Confirm Subscription
          </button> */}
        </>
      ) : (
        <>
          <DialogTitle className="text-xl font-semibold text-primary">
            🎉 You're Already Subscribed!
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            It looks like you've already signed up for our <span className="font-medium">Free Privacy Audit</span>.  
            No worries! Our team is already working on your review.
          </DialogDescription>
          {/* <button
            onClick={() => setSubscribed(false)}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600 transition-colors"
          >
            Reset Subscription
          </button> */}
        </>
      )}
    </div>
  );
};

export default FreeAudit;
