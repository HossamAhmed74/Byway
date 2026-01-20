import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/MainComponents/SignUp";
import Login from "./components/MainComponents/Login";
import LandingWithoutLogin from "./components/MainComponents/LandingWithoutLogin";
import LandingPageWithLogin from "./components/LandingPageWithLogin/LandingPageWIthLogin";
import DesignCourses from "./components/Courses/DesignCourses";
import CourseDetails from "./components/Courses/CourseDetails";
import ShoppingCart from "./components/Courses/ShoppingCart";
import CheckoutPage from "./components/Courses/CheckoutPage";
import PurchaseComplete from "./components/Courses/PurchaseCompleted";
import Dashboard from "./components/MainComponents/Dashboard";
import Instructors from "./components/Instructors/Instructors";
import CoursesPage from "./components/Courses/Courses";
import AddCourseModal from "./components/Courses/CreateCourse";
import ProtectedRoute from "./services/ProtectedRoute";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingWithoutLogin />} />
          <Route
            path="/LandingWithLogin"
            element={
              <ProtectedRoute>
                <LandingPageWithLogin />
              </ProtectedRoute>
            }
          />
          <Route path="/designCourses" element={<DesignCourses />} />
          <Route path="/courseDetails" element={<CourseDetails />} />
          <Route path="/shoppingCart" element={<ShoppingCart />} />
          <Route path="/checkoutPage" element={<CheckoutPage />} />
          <Route path="/purchaseCompleted" element={<PurchaseComplete />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructors"
            element={
              <ProtectedRoute>
                <Instructors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addCourse"
            element={
              <ProtectedRoute>
                <AddCourseModal />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
