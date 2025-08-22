"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search, MessageCircle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Error Number */}
        <div className="relative">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500/20 to-teal-500/20 -z-10"></div>
        </div>

        {/* Main Content */}
        <Card className="border-zinc-800 bg-zinc-950/60 backdrop-blur">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <MessageCircle className="h-16 w-16 text-zinc-400" />
            </div>
            <CardTitle className="text-3xl text-white">
              Page Not Found
            </CardTitle>
            <p className="text-zinc-400 text-lg">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-sm text-zinc-500 space-y-2">
              <p>This could happen if:</p>
              <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                <li>The URL was typed incorrectly</li>
                <li>The page has been deleted or moved</li>
                <li>You clicked on a broken link</li>
                <li>You don't have permission to access this page</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                <Link href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>

              <Button 
                asChild
                variant="outline"
                className="border-zinc-700 text-zinc-600 hover:bg-zinc-800"
              >
                <Link href="/feed" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  View Feed
                </Link>
              </Button>

              <Button 
                variant="ghost"
                className="text-zinc-400 hover:bg-zinc-800 hover:text-white flex items-center gap-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>

           
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            Home
          </Link>
          <Link href="/feed" className="hover:text-zinc-300 transition-colors">
            Feed
          </Link>
          <span className="text-zinc-700">•</span>
          <span>MicroBlog</span>
        </div>
      </div>
    </div>
  );
}