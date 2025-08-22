"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { signOut, useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Heart, Bookmark, PenSquare, TrendingUp, Eye } from "lucide-react";

import { Session } from "next-auth";
import { useRouter } from "next/navigation";

interface BlogPost {
  id: string;
  author: {
    email: string;
    username: string;
    avatar: string;
  };
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  readTime: string;
  createdAt: string;
}

export const FeedPage = ({ session }: { session: Session | null }) => {
  const { data: clientSession } = useSession();
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const mockPosts = [
    {
      id: "1",
      author: {
        email: "user1@example.com",
        username: "User1",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      title: "Mock Post 1",
      content: "This is the content of mock post 1.",
      excerpt: "This is the content of mock post 1.",
      tags: ["tag1", "tag2"],
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false,
      isBookmarked: false,
      readTime: "1 min read",
      createdAt: new Date().toISOString().split("T")[0],
    },
    {
      id: "2",
      author: {
        email: "user2@example.com",
        username: "User2",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      title: "Mock Post 2",
      content: "This is the content of mock post 2.",
      excerpt: "This is the content of mock post 2.",
      tags: ["tag2", "tag3"],
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false,
      isBookmarked: false,
      readTime: "1 min read",
      createdAt: new Date().toISOString().split("T")[0],
    },
  ];
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);

  // Función para verificar si el usuario puede interactuar
  const canInteract = () => {
    return !isGuest && (session || clientSession);
  };

  const handleLike = (postId: string) => {
    // Verificar si el usuario puede interactuar
    if (!canInteract()) {
      return;
    }

    // Optimistically update the UI
    const likePost = async (id: string) => {
      await fetch("/api/dynamo/like-comment", {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
    };

    likePost(postId).catch((error) => {
      console.error("Error liking post:", error);
    });

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.likes + 1 }
          : post
      )
    );
  };

  const handleBookmark = (postId: string) => {
    // Verificar si el usuario puede interactuar
    if (!canInteract()) {
      return;
    }

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/dynamo/comments");
      const data = await response.json();
      if (data.response) {
        setPosts(data.response);
      } else {
        setPosts(mockPosts);
      }
    } catch (error) {
      console.log(mockPosts)
      console.error("Error fetching posts:", error);
    }
  };

  const getTrendingTopics = async () => {
    if (!posts || posts.length === 0) return [];
    const tags = posts
      .flatMap((post) => post.tags)
      .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const sortedTags = Object.entries(tags)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([tag]) => tag)
      .slice(0, 5);

    return sortedTags;
  };

  useEffect(() => {
    getTrendingTopics().then(setTrendingTopics);
  }, [posts]);

  const handleSubmitPost = async () => {
    // Verificar si el usuario puede interactuar
    if (!canInteract()) {
      return;
    }

    if (newPost.title && newPost.content) {
      const post: BlogPost = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString().split("T")[0],
        author: {
          username: session?.user?.name || "Anonymous",
          email: session?.user?.email || "barfoo@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        title: newPost.title,
        content: newPost.content,
        excerpt: newPost.content.substring(0, 120) + "...",
        tags: newPost.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        isLiked: false,
        isBookmarked: false,
        readTime: `${Math.ceil(
          newPost.content.split(" ").length / 200
        )} min read`,
      };

      setPosts([post, ...posts]);
      setNewPost({ title: "", content: "", tags: "" });

      await fetch("/api/dynamo/post-comment", {
        method: "POST",
        body: JSON.stringify(post),
        headers: { "Content-Type": "application/json" },
      });

      fetchPosts();
      setIsComposeOpen(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const guestMode = userType === "guest";

    setIsGuest(guestMode);
    setIsLoading(false);

    // Si no hay sesión del servidor ni del cliente, y tampoco es invitado, redirigir
    if (!session && !clientSession && !guestMode) {
      router.push("/");
    }
  }, [session, clientSession, router]);

  // Mostrar loading mientras verificamos el estado
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const currentSession = session || clientSession;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Topics
              </h2>
            </CardHeader>
            <CardContent className="space-y-2">
              {trendingTopics.length === 0 && (
                <p>No trending topics available</p>
              )}
              {trendingTopics.length > 0 &&
                trendingTopics.map((topic, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    {topic}
                  </Badge>
                ))}
            </CardContent>
          </Card>

          {/* Guest Info Card */}
          {isGuest && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-800">
                  <Eye className="h-5 w-5" />
                  Guest Mode
                </h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-blue-700">
                  You're browsing as a guest. You can view posts but can't
                  interact with them.
                </p>
                <Button
                  onClick={() => router.push("/")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  Sign In to Interact
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Blog Feed</h1>

            <div className="flex items-center gap-4">
              {/* Mostrar botones solo si puede interactuar */}
              {canInteract() ? (
                <>
                  <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <PenSquare className="h-4 w-4" />
                        Write Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Blog Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            placeholder="Enter your blog post title..."
                            value={newPost.title}
                            onChange={(e) =>
                              setNewPost({ ...newPost, title: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="content">Content</Label>
                          <Textarea
                            id="content"
                            placeholder="Write your blog post content..."
                            className="min-h-[200px]"
                            value={newPost.content}
                            onChange={(e) =>
                              setNewPost({
                                ...newPost,
                                content: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="tags">Tags (comma separated)</Label>
                          <Input
                            id="tags"
                            placeholder="e.g. React, JavaScript, Web Development"
                            value={newPost.tags}
                            onChange={(e) =>
                              setNewPost({ ...newPost, tags: e.target.value })
                            }
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsComposeOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSubmitPost}>
                            Publish Post
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    className="bg-red-600 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    Guest Mode
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/")}
                    size="sm"
                    className="cursor-pointer"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {posts && posts.length === 0 && (
              <div className="text-center text-muted-foreground">
                No posts found.
              </div>
            )}
            {posts && 
              posts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={post.author.avatar || "/placeholder.svg"}
                            alt={post.author.username}
                          />
                          <AvatarFallback>
                            {post.author.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              @{post.author.username}
                            </h3>
                            <span className="text-muted-foreground">
                              {post.author.email}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground text-sm">
                              {post.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {post.readTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold mb-2 cursor-pointer hover:text-primary">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex items-center gap-2 ${
                            post.isLiked ? "text-red-500" : ""
                          } ${
                            !canInteract()
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() => handleLike(post.id)}
                          disabled={!canInteract()}
                          title={!canInteract() ? "Sign in to like posts" : ""}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              post.isLiked ? "fill-current" : ""
                            }`}
                          />
                          {post.likes}
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${
                          post.isBookmarked ? "text-blue-500" : ""
                        } ${
                          !canInteract() ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleBookmark(post.id)}
                        disabled={!canInteract()}
                        title={
                          !canInteract() ? "Sign in to bookmark posts" : ""
                        }
                      >
                        <Bookmark
                          className={`h-4 w-4 ${
                            post.isBookmarked ? "fill-current" : ""
                          }`}
                        />
                      </Button>
                    </div>

                    {/* Mensaje para invitados */}
                    {isGuest && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700 text-center">
                          <button
                            onClick={() => router.push("/")}
                            className="text-blue-600 hover:underline font-medium cursor-pointer"
                          >
                            Sign in
                          </button>{" "}
                          to like, bookmark, and create posts
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
