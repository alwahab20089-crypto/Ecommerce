import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GuestWishlistProvider } from "./context/GuestWishlistContext.jsx";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GuestCartProvider } from "./context/GuestCartContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";


const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GuestCartProvider>
            <GuestWishlistProvider>
              <App />
            </GuestWishlistProvider>
          </GuestCartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);