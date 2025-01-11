import Image from "next/image";
import {
  Geist,
  Geist_Mono,
  Roboto,
  IBM_Plex_Sans,
  League_Spartan,
} from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import title from "../../public/title.png";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "Syllabuddy",
  description: "Snap, Sync, Succeed!",
};

export default function RootLayout({ children }) {
  return (
    <GoogleOAuthProvider clientId="953828523163-jdvi9hegbihalfrfd84t8dkk1ahnm1lr.apps.googleusercontent.com">
      <html lang="en">
        <body
          className={`${leagueSpartan.className} ${geistSans.variable} ${geistMono.variable} antialiased text-black bg-white min-h-screen`}
        >
          <div className="flex items-center justify-center bg-white py-6">
            <Image
              src={title}
              alt="Syllabuddy"
              width={500}
              height={500}
              className="object-cover h-32 w-64"
            />
          </div>
          {children}
          <footer className="flex items-center justify-center bg-white py-6 mt-12">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Syllabuddy
            </p>
          </footer>
        </body>
      </html>
    </GoogleOAuthProvider>
  );
}
