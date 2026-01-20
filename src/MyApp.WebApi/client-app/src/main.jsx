import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "jotai";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <>
    <Provider>
      <GoogleOAuthProvider clientId="6764628660-sonerk08umc8t35denr7dr6r31l52v0l.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </Provider>
    <Toaster position="top-right" />
  </>
);
