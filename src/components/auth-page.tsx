"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle} from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white grid lg:grid-cols-2">
      {/* Left: Branding / Visual */}
      <div className="hidden lg:flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black">
        <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]">
          <div className="absolute -top-24 -left-24 size-[420px] rounded-full blur-3xl opacity-30 bg-white/10" />
          <div className="absolute -bottom-16 -right-10 size-[360px] rounded-full blur-3xl opacity-20 bg-white/10" />
        </div>
        <div className="relative flex flex-col items-center gap-6">
          <MessageCircle className="h-40 w-40 md:h-56 md:w-56 text-white" />
          <p className="text-zinc-300/80 max-w-sm text-center leading-relaxed">
            MicroBlog — share short ideas, images and links with the community.
          </p>
        </div>
      </div>

      {/* Right: Auth Card */}
      <div className="flex items-center justify-center p-6 sm:p-8">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/60 backdrop-blur">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-3 lg:hidden">
              <span className="text-lg font-semibold">MicroBlog</span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl text-white">Sign in to MicroBlog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              className="w-full h-11 font-semibold bg-gradient-to-r from-blue-500 to-teal-500 cursor-pointer"
              onClick={() => signIn("cognito", { callbackUrl: "/feed" })}
            >
              Sign in
            </Button>
            <p className="text-center text-sm text-zinc-400">
              Don&apos;t have an account?{" "}
              <button
                onClick={() =>
                  signIn(
                    "cognito",
                    { callbackUrl: "/feed" },
                    { screen_hint: "signup", prompt: "login" }
                  )
                }
                className="text-blue-400 hover:underline ml-1 cursor-pointer"
              >
                Sign up
              </button>
            </p>
            <p>
              or continue as guest{" "}
              <button
                onClick={() => {
                  localStorage.setItem("userType", "guest");
                  router.push("/feed");
                }}
                className="text-blue-400 hover:underline ml-1 cursor-pointer"
              >
                Continue as Guest
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
