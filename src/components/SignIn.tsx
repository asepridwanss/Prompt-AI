"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";

type SignInProps = {
  onClose?: () => void;
};

const SignIn = ({ onClose }: SignInProps) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      alert("Login gagal");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50">
      <Card className="w-full max-w-md rounded-lg bg-white p-8 shadow-md text-black">
        <CardHeader className="text-center relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700 text-lg"
              aria-label="Close"
            >
              ✕
            </button>
          )}

          <div className="flex justify-center mb-4">
            <Image
              src="/image/logo.png"
              alt="Porsi AI Logo"
              width={160}
              height={80}
              priority
            />
          </div>
          {/* <h2 className="text-xl font-semibold text-gray-800">Login</h2> */}
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Login</h2>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-800 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="text-right">
              <a
                href="https://api.whatsapp.com/send?phone=6281292692622&text=Halo%20Admin,%20saya%20lupa%20password%20akun%20saya."
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full rounded bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
            >
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
