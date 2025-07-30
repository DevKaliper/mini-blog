"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Component() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (username: string, password: string) => {
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
    } else {
      router.push("/feed");
    }
  };

  const encryptPassword = async (password: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = await encryptPassword(formData.get("password") as string);

    // Handle sign-up logic here
    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      await handleLogin(username, password);
    } else {
      console.error("Sign-up failed");
      //TODO: Handle error (e.g., show a notification)
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left side - Logo/Branding */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center bg-black">
        <X className="h-80 w-80 text-white" />
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-black">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center">
            <X className="h-12 w-12 text-white" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Join X today</h1>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={"Email"}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder={"Username"}
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-black border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-full"
              >
                Create account
              </Button>
            </form>

            {isLogin && (
              <div className="text-center">
                <button className="text-blue-400 hover:underline text-sm">
                  Forgot password?
                </button>
              </div>
            )}

            <div className="text-center space-y-4">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/")}
                  className="text-blue-400 hover:underline"
                >
                  Sign in
                </button>
              </p>

              <p className="text-xs text-gray-500 leading-relaxed">
                By signing up, you agree to the{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  Privacy Policy
                </a>
                , including{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  Cookie Use
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
