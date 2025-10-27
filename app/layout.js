import { Inter } from "next/font/google";
import "./globals.css";
import { SnackProvider } from "./SnackProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Continuous Calendar",
  description: "A simple, fully customizable React Calendar, styled with Tailwindcss.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-gray-200">
      <body className={inter.className}>
        <SnackProvider>
          {children}
        </SnackProvider>
      </body>
    </html>
  );
}
