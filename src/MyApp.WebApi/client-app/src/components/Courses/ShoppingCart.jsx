import CourseImage from "../../assets/landing page without login/Rectangle 1080.png";
// ShoppingCart.jsx
import React, { useEffect } from "react";
import Footer from "../MainComponents/Footer";
import Header from "../MainComponents/HeaderWithLogin";
import { cartItemsAtom } from "../Jotai/cartItems/cartAtom";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";

const ShoppingCart = () => {
  const [cartItemsState, setCartItemsAtom] = useAtom(cartItemsAtom);
  const discount = 10.0; // Example discount amount

  // Calculate totals
  const subtotal = cartItemsState.reduce((sum, item) => sum + item.cost, 0);
  const tax = subtotal * 0.15; // 15% tax example
  const total = subtotal + tax;

  const removeFromCart = (itemToRemove) => {
    const updatedCart = cartItemsState.filter(
      (item) => item.id !== itemToRemove.id
    );
    setCartItemsAtom(updatedCart);
  };
  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            {/* Main Heading */}
            <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>

            {/* Breadcrumb */}
            <div className="flex text-sm relative bottom-6 left-[13rem]">
              <a href="/designCourses" className="text-blue-600 hover:text-blue-800">
                Courses
              </a>
              <span className="mx-2 text-gray-400">›</span>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Details
              </a>
              <span className="mx-2 text-gray-400">›</span>
              <span className="text-gray-600">Shopping Cart</span>
            </div>

            {/* Subtitle */}
            <p className="text-gray-600 mt-2">3 Courses in cart</p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItemsState.map((item, index) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg shadow p-4 flex items-start ${
                    index === 0 ? "border-2 border-blue-500" : ""
                  }`}
                >
                  {/* Course Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg mr-4"
                  />

                  {/* Course Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      By {item.instructorName}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 mr-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            className={`w-4 h-4 ${
                              i < Math.floor(item?.rate)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            aria-hidden="true"
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <span>{item.totalHours} hours </span>
                      <span className="mx-1">•</span>
                      <span>{item.totalLecturesNumber} Lectures</span>
                      <span className="mx-1">•</span>
                      <span>{item.level}</span>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="text-right">
                    <div className="font-bold text-gray-800 mb-2">
                      ${item.cost.toFixed(2)}
                    </div>
                    <button
                      className="text-sm text-red-600 hover:text-red-800"
                      onClick={() => removeFromCart(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 ml-1">
                Order Details
              </h2>
              <div className="bg-white rounded-lg shadow p-6">
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
              </div>
              <Link
                to="/checkoutPage"
                className="block w-full mt-3 py-3 bg-gray-900 text-white text-center font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-sm"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ShoppingCart;
