"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  GripVertical,
  Save,
} from "lucide-react";
import { InstagramPost } from "@/lib/types/database";
import {
  getInstagramPosts,
  upsertInstagramPost,
  deleteInstagramPost,
  updateInstagramLimit,
  getInstagramLimit,
} from "@/lib/actions/instagram";
import { SingleImageUpload } from "@/components/admin/single-image-upload";
import { motion, Reorder } from "motion/react";

export function InstagramManager() {
  const router = useRouter();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [limit, setLimit] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadData() {
      const [fetchedPosts, fetchedLimit] = await Promise.all([
        getInstagramPosts(),
        getInstagramLimit(),
      ]);
      setPosts(fetchedPosts);
      setLimit(fetchedLimit);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleAddPost = () => {
    const newPost: Partial<InstagramPost> = {
      image_url: "",
      post_url: "",
      display_order: posts.length,
      is_active: true,
    };
    setPosts([...posts, newPost as InstagramPost]);
  };

  const handleUpdatePost = (
    index: number,
    updates: Partial<InstagramPost & { imageFile?: File }>,
  ) => {
    const newPosts = [...posts];
    newPosts[index] = { ...newPosts[index], ...updates } as InstagramPost;
    setPosts(newPosts);
  };

  const handleDeletePost = async (id: string, index: number) => {
    if (!id) {
      setPosts(posts.filter((_, i) => i !== index));
      return;
    }

    startTransition(async () => {
      const result = await deleteInstagramPost(id);
      if (result.success) {
        setPosts(posts.filter((p) => p.id !== id));
        toast.success("Post deleted");
      } else {
        toast.error("Failed to delete post");
      }
    });
  };

  const handleSave = async () => {
    startTransition(async () => {
      try {
        // 1. Update limit
        await updateInstagramLimit(limit);

        // 2. Upload pending images first
        const postsToUpsert = [...posts];

        for (let i = 0; i < postsToUpsert.length; i++) {
          const post = postsToUpsert[i] as any;
          if (post.imageFile) {
            // Import and use server-side upload helper won't work direct in client
            // We'll use the existing supabase storage client for client-side uploads here
            // to keep it simple for the manager since it's already a complex client component.
            const file = post.imageFile;
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();

            const { error: uploadError } = await supabase.storage
              .from("product-images")
              .upload(filePath, file);

            if (uploadError)
              throw new Error(
                `Upload failed for post ${i + 1}: ${uploadError.message}`,
              );

            const { data } = supabase.storage
              .from("product-images")
              .getPublicUrl(filePath);
            postsToUpsert[i] = { ...post, image_url: data.publicUrl };
            delete (postsToUpsert[i] as any).imageFile;
          }
        }

        // 3. Upsert posts
        const results = await Promise.all(
          postsToUpsert.map((post, index) =>
            upsertInstagramPost({ ...post, display_order: index }),
          ),
        );

        const hasError = results.some((r) => !r.success);
        if (hasError) {
          toast.error("Some posts failed to save");
        } else {
          toast.success("Changes saved successfully");
          const updatedPosts = await getInstagramPosts();
          setPosts(updatedPosts);
        }
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Failed to save changes");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Settings Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-accent/5">
          <CardTitle className="font-serif">Feed Settings</CardTitle>
          <CardDescription>
            Configure how many posts appear on the home page.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 max-w-xs">
            <div className="flex-1 space-y-2">
              <Label htmlFor="limit">Display Limit</Label>
              <Input
                id="limit"
                type="number"
                min={1}
                max={20}
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 0)}
              />
            </div>
            <Button
              className="mt-8 bg-gold hover:bg-gold/90 text-white"
              onClick={handleSave}
              disabled={isPending}
            >
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid Management */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-serif">Instagram Posts</h2>
          <p className="text-sm text-muted-foreground">
            Manage individual posts in your feed.
          </p>
        </div>
        <Button
          onClick={handleAddPost}
          variant="outline"
          className="border-gold/30 text-gold hover:bg-gold/5"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Post
        </Button>
      </div>

      <div className="space-y-4">
        <Reorder.Group
          axis="y"
          values={posts}
          onReorder={setPosts}
          className="space-y-4"
        >
          {posts.map((post, index) => (
            <Reorder.Item key={post.id || `new-${index}`} value={post}>
              <Card className="border-border/40 hover:border-gold/30 transition-colors shadow-sm overflow-hidden">
                <CardContent className="p-4 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex items-center self-stretch px-2 text-muted-foreground/30 hover:text-gold/50 cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-6 w-6" />
                  </div>

                  <div className="w-full md:w-48">
                    <SingleImageUpload
                      name={`instagram-post-${index}`}
                      defaultValue={post.image_url}
                      onChange={(val) =>
                        handleUpdatePost(
                          index,
                          typeof val === "string"
                            ? { image_url: val }
                            : { imageFile: val },
                        )
                      }
                    />
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-2">
                      <Label>Post Link</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://instagram.com/p/..."
                          value={post.post_url}
                          onChange={(e) =>
                            handleUpdatePost(index, {
                              post_url: e.target.value,
                            })
                          }
                        />
                        {post.post_url && (
                          <Button variant="ghost" size="icon" asChild>
                            <a
                              href={post.post_url}
                              target="_blank"
                              rel="noopener"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive self-end md:self-center"
                    onClick={() => handleDeletePost(post.id!, index)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {posts.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">
              No posts added yet. Click "Add Post" to get started.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-6">
          <Button
            className="bg-gold hover:bg-gold-dark text-white px-10 tracking-widest uppercase font-bold shadow-md shadow-gold/20"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
