import localFont from "next/font/local";
import "./globals.css";
import { Navbar, ThemeProvider, CheckUser } from "@/components";
import { NormalToaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Red Apple Cars",
  description: "Admin Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = savedTheme === 'system' ? (systemDark ? 'dark' : 'light') : (savedTheme || 'system');
                document.documentElement.classList.add(theme === 'system' ? (systemDark ? 'dark' : 'light') : theme);
              })();
            `,
          }}
        />
      </head>
      <body
        className={`bg-cardBg ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CheckUser>
            <Navbar>{children}</Navbar>
          </CheckUser>
        </ThemeProvider>
        <NormalToaster position="top-center" richColors />
      </body>
    </html>
  );
}
