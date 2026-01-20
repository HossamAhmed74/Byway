import VisaImage from "../../assets/Visa.png";
import PaypalImage from "../../assets/Paypal.png";
// CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import Footer from "../MainComponents/Footer";
import Header from "../MainComponents/HeaderWithLogin";
import { cartItemsAtom } from "../Jotai/cartItems/cartAtom";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { purchaseProcessAtom } from "../Jotai/PurchaseProcess/PurchaseProcessAtom";
import { useForm } from "react-hook-form";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cartItemsState, setCartItemsAtom] = useAtom(cartItemsAtom);
  const [purchaseProcessState, setPurchaseProcessAtom] =
    useAtom(purchaseProcessAtom);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      country: purchaseProcessState.country || "",
      state: purchaseProcessState.state || "",
      paymentMethod: purchaseProcessState.paymentMethod || "",
      cardName: purchaseProcessState.cardName || "",
      cardNumber: purchaseProcessState.cardNumber || "",
      expiryDate: purchaseProcessState.expiryDate || "",
      CVV: purchaseProcessState.CVV || "",
      coursesIds: cartItemsState.map((item) => item.id) || [],
    },
  });

  const completePurchaseProcess = async (data) => {
    if (data) {
      const purchaseProcess = {
        country: data.country,
        state: data.state,
        paymentMethod: paymentMethod,
        cardName: data.cardName,
        cardNumber: data.cardNumber,
        expiryDate: data.expiryDate,
        CVV: data.CVV,
        coursesIds: cartItemsState.map((item) => item.id),
        discount: 0.0,
        tax: 20.25,
        totalAmount:
          cartItemsState.reduce((sum, item) => sum + item.cost, 0) +
          20.25 -
          0.0,
      };

      //update atom
      setPurchaseProcessAtom(purchaseProcess);

      if (purchaseProcess) {
        const res = await fetch("/api/PurchaseProcess/Create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(purchaseProcess),
        });

        if (res.ok) {
          setCartItemsAtom([]); 
          navigate("/purchaseCompleted");
        } else {
          console.error("Purchase completion failed.");
        }
      }
    }
  };

  // Example values (you can replace with dynamic data)
  const subtotal = cartItemsState.reduce((sum, item) => sum + item.cost, 0);
  const discount = 0.0;
  const tax = 20.25;
  const total = subtotal + tax - discount;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit(completePurchaseProcess)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Checkout Form (2/3 width on large screens) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 border-2 border-blue-500">
                {/* Header/Breadcrumb */}
                <header className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Checkout Page
                  </h1>
                  <nav className="flex text-sm mt-1">
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      Details
                    </a>
                    <span className="mx-2 text-gray-400">›</span>
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      Shopping Cart
                    </a>
                    <span className="mx-2 text-gray-400">›</span>
                    <span className="text-gray-600">Checkout</span>
                  </nav>
                </header>

                {/* Country & State Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      {...register("country", {
                        required: "Country is required",
                        minLength: {
                          value: 3,
                          message: "Country must be at least 3 characters",
                        },
                      })}
                      placeholder="Enter Country"
                      className={
                        formErrors.country
                          ? "w-full px-3 py-2 border border-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          : "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }
                    />
                    {formErrors.country && (
                      <span className="text-red-500 text-sm mt-1">
                        {formErrors.country.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Union Territory
                    </label>
                    <input
                      type="text"
                      placeholder="Enter State"
                      {...register("state", {
                        required: "State is required",
                        minLength: {
                          value: 3,
                          message: "State must be at least 3 characters",
                        },
                      })}
                      className={
                        formErrors.state
                          ? "w-full px-3 py-2 border border-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          : "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      }
                    />
                    {formErrors.state && (
                      <span className="text-red-500 text-sm mt-1">
                        {formErrors.state.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Payment Method Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Payment Method
                  </h2>

                  {/* Credit/Debit Card Option */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-4">
                      <input
                        type="radio"
                        id="credit"
                        name="payment"
                        checked={paymentMethod === "credit"}
                        onChange={() => setPaymentMethod("credit")}
                        {...register("paymentMethod")}
                        className="h-4 w-4 text-blue-600 focus:ring-2 accent-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor="credit"
                        className="ml-2 block text-sm font-medium text-gray-700"
                      >
                        Credit/Debit Card
                      </label>
                      <div className="ml-auto">
                        <img
                          src={VisaImage}
                          alt="Visa"
                          className="h-8 w-auto"
                        />
                      </div>
                    </div>

                    {/* Card Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name of Card
                        </label>
                        <input
                          type="text"
                          {...register("cardName", {
                            required: "Card Name is required",
                            minLength: {
                              value: 3,
                              message:
                                "Card Name must be at least 3 characters",
                            },
                          })}
                          placeholder="Name of card"
                          className={
                            formErrors.cardName
                              ? "w-full px-3 py-2 border border-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              : "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          }
                        />
                        {formErrors.cardName && (
                          <span className="text-red-500 text-sm mt-1">
                            {formErrors.cardName.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="Card Number"
                          {...register("cardNumber", {
                            required: "Card Number is required",
                            pattern: {
                              value: /^(?:\d\s?){13,19}$/,
                              message: "Card number must be 13–19 digits",
                            },
                          })}
                          className={
                            formErrors.cardNumber
                              ? "w-full px-3 py-2 border border-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              : "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          }
                        />
                        {formErrors.cardNumber && (
                          <span className="text-red-500 text-sm mt-1">
                            {formErrors.cardNumber.message}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="date"
                            placeholder="MM/YY"
                            {...register("expiryDate", {
                              required: "Expiry Date is required",
                            })}
                            className={
                              formErrors.expiryDate
                                ? "w-full px-3 py-2 border border-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                : "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            }
                          />
                          {formErrors.expiryDate && (
                            <span className="text-red-500 text-sm mt-1">
                              {formErrors.expiryDate.message}
                            </span>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVC/CVV
                          </label>
                          <input
                            type="text"
                            {...register("CVV", {
                              required: "CVV is required",
                              pattern: {
                                value: /^\d{3,4}$/,
                                message: "CVV must be 3 or 4 digits",
                              },
                            })}
                            placeholder="CVC/CVV"
                            className={
                              formErrors.CVV
                                ? "w-full px-3 py-2 border border-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                : "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            }
                          />
                          {formErrors.CVV && (
                            <span className="text-red-500 text-sm mt-1">
                              {formErrors.CVV.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PayPal Option */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="paypal"
                        name="payment"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                        className="h-4 w-4 text-blue-600 focus:ring-2 accent-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor="paypal"
                        className="ml-2 block text-sm font-medium text-gray-700"
                      >
                        PayPal
                      </label>
                      <div className="ml-auto">
                        <img
                          src={PaypalImage}
                          alt="PayPal"
                          className="h-8 w-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Details (1/3 width on large screens) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Order Details ({cartItemsState.length})
                </h2>

                {/* Course List */}
                <div className="space-y-2 mb-4">
                  {cartItemsState.map((course, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-800 truncate">
                        {course.name}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Apply Coupon Code */}
                <div className="mb-4">
                  <button className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      fill="currentColor"
                      className="w-5 h-5 mr-1"
                    >
                      <path d="M43 7h-5a2 2 0 0 0-1.4.6L34 10.2l-2.6-2.6A2 2 0 0 0 30 7H5a3 3 0 0 0-3 3v28a3 3 0 0 0 3 3h25a2 2 0 0 0 1.4-.6L34 37.8l2.6 2.6A2 2 0 0 0 38 41h5a3 3 0 0 0 3-3V10a3 3 0 0 0-3-3ZM42 37h-3.2l-3.4-3.4a2 2 0 0 0-2.8 0L29.2 37H6V11h23.2l3.4 3.4a2 2 0 0 0 2.8 0L38.8 11H42Z" />
                      <path d="M34 17a2 2 0 0 0-2 2v2a2 2 0 0 0 4 0v-2a2 2 0 0 0-2-2ZM34 25a2 2 0 0 0-2 2v2a2 2 0 0 0 4 0v-2a2 2 0 0 0-2-2Z" />
                      <circle cx="14" cy="20" r="2" />
                      <circle cx="22" cy="28" r="2" />
                      <path d="M21.6 17.6l-10 10a2 2 0 0 0 2.8 2.8l10-10a2 2 0 0 0-2.8-2.8Z" />
                    </svg>
                    APPLY COUPON CODE
                  </button>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium">${discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-gray-800">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full mt-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
