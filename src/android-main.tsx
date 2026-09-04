import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppShell } from "@/components/app-shell";
import { AuthProvider } from "@/lib/auth/provider";
import { ThemeProvider } from "@/lib/theme";
import { bootNativeShell } from "@/lib/native";
import "./styles.css";

void bootNativeShell();

const root = document.getElementById("root");
if (!root) throw new Error("Aetherion root missing");

createRoot(root).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
