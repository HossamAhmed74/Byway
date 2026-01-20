import React from "react";
import PurchaseCompletedImage from "../../assets/purchaseCompleted.png";
import Header from "../MainComponents/HeaderWithLogin";
import Footer from "../MainComponents/Footer";
import { Link } from "react-router-dom";

const PurchaseComplete = () => {
  return (
    <>
      <Header />
      <div className="max-h-15 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          {/* Success Icon */}
          <div className="w-full h-full rounded-full flex items-center justify-center mx-auto mb-6">
            <img
              src={PurchaseCompletedImage}
              alt="Purchase Complete"
              className="w-max h-max "
            />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Purchase Complete
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-6">
            You Will Receive a confirmation email soon!
          </p>

          {/* Back to Home Button */}
          <Link to="/dashboard" className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Back to home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PurchaseComplete;
