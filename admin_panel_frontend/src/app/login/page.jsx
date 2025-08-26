"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { lightTheme, darkTheme } from "@/app/colors";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  const theme = isDarkMode ? darkTheme : lightTheme;

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would make an API call here
      console.log("Login successful");
      router.push("/");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme.background} ${theme.text}`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg ${theme.cardBg} border ${theme.border}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${theme.heading}`}>Login</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${theme.secondaryBtn}`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${theme.text}`}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 rounded-md ${theme.inputBg} ${theme.inputText} border ${theme.inputBorder} focus:outline-none focus:ring-2 focus:ring-red-500`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className={`mt-1 text-sm ${theme.error} px-2 py-1 rounded-md border`}>{errors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${theme.text}`}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 rounded-md ${theme.inputBg} ${theme.inputText} border ${theme.inputBorder} focus:outline-none focus:ring-2 focus:ring-red-500`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className={`mt-1 text-sm ${theme.error} px-2 py-1 rounded-md border`}>{errors.password}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className={`h-4 w-4 rounded ${theme.inputBorder} ${theme.text} focus:ring-red-500`}
              />
              <label htmlFor="remember-me" className={`ml-2 block text-sm ${theme.text}`}>
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className={`font-medium ${theme.link}`}>
                Forgot your password?
              </a>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium ${theme.primaryBtn}`}
            >
              Sign in
            </button>
          </div>
        </form>
        
        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${theme.border}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${theme.cardBg} ${theme.text}`}>
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <a
                href="#"
                className={`w-full inline-flex justify-center py-2 px-4 rounded-md border ${theme.border} ${theme.secondaryBtn} text-sm font-medium`}
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </a>
            </div>
            
            <div>
              <a
                href="#"
                className={`w-full inline-flex justify-center py-2 px-4 rounded-md border ${theme.border} ${theme.secondaryBtn} text-sm font-medium`}
              >
                <span className="sr-only">Sign in with GitHub</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div> */}
        
        <p className={`mt-8 text-center text-sm ${theme.text}`}>
          Don't have an account?{' '}
          <a href="#" className={`font-medium ${theme.link}`}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}