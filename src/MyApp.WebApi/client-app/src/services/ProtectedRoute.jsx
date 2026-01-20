import { usePublicAuthChecker } from "./authService";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = usePublicAuthChecker();
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please log in first!");
      navigate("/login", { replace: true });
    }
    setChecked(true);
  }, [isLoggedIn, navigate]);

  if (!checked) return null; // prevent rendering too early

  return isLoggedIn ? children : null;
}
