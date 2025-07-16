"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { signOut } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Bookmark,
  PenSquare,
  TrendingUp,
} from "lucide-react";

interface BlogPost {
  id: string;
  idPartition: string;
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


import { Session } from "next-auth";

export const FeedPage = ({ session }: { session: Session | null }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);

  const handleLike = (postId: string) => {
    // Optimistically update the UI
    const likePost = async (idPartition: string) => {
      await fetch("/api/dynamo/like-comment", {
        method: "POST",
        body: JSON.stringify({ idPartition }),
        headers: { "Content-Type": "application/json" },
      });
    };

    likePost(postId).catch((error) => {
      console.error("Error liking post:", error);
    });

    setPosts(
      posts.map((post) =>
        post.idPartition === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.likes + 1 }
          : post
      )
    );


  };

  const handleBookmark = (postId: string) => {
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
        setPosts(data.response);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    
    const getTrendingTopics = async () => {
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
    if (newPost.title && newPost.content) {
      const post: BlogPost = {
        id: Date.now().toString(),
        idPartition: crypto.randomUUID(),
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
        timestamp:  new Date().toISOString(),
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
              {trendingTopics.map((topic, index) => (
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
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Blog Feed</h1>

            <div className="flex items-center gap-4">
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
                          setNewPost({ ...newPost, content: e.target.value })
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
                      <Button onClick={handleSubmitPost}>Publish Post</Button>
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
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {posts.length === 0 && (
              <div className="text-center text-muted-foreground">
                No posts found.
              </div>
            )}
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
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
                          <h3 className="font-semibold">@{post.author.username}</h3>
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
                      <Badge key={index} variant="outline" className="text-xs">
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
                        }`}
                        onClick={() => handleLike(post.idPartition)}
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
                      className={`${post.isBookmarked ? "text-blue-500" : ""}`}
                      onClick={() => handleBookmark(post.id)}
                    >
                      <Bookmark
                        className={`h-4 w-4 ${
                          post.isBookmarked ? "fill-current" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
