"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Layout,
  Type,
  Image as ImageIcon,
  MousePointer2,
  Minus,
  Share2,
  Save,
  Eye,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import {
  generateCampaignHtml,
  type EmailBlock,
} from "@/lib/marketing/templates";
import { createCampaign } from "@/lib/actions/campaigns";
import { toast } from "sonner";
import Link from "next/link";

export default function NewCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const [settings, setSettings] = useState({
    name: "",
    subject_line: "",
    preview_text: "",
  });

  const [blocks, setBlocks] = useState<EmailBlock[]>([
    { type: "header" },
    {
      type: "hero",
      imageUrl:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      title: "New Arrivals",
      subtitle: "Shop our latest collection",
    },
    {
      type: "text",
      content:
        "Check out the newest pieces added to our catalog. Modern elegance, wrapped in culture.",
    },
    { type: "cta", label: "Shop Now", url: "/shop" },
    { type: "socials" },
  ]);

  useEffect(() => {
    setPreviewHtml(generateCampaignHtml(blocks));
  }, [blocks]);

  const addBlock = (type: EmailBlock["type"]) => {
    switch (type) {
      case "text":
        setBlocks([...blocks, { type: "text", content: "New text block..." }]);
        break;
      case "hero":
        setBlocks([
          ...blocks,
          { type: "hero", imageUrl: "", title: "Hero Title" },
        ]);
        break;
      case "cta":
        setBlocks([...blocks, { type: "cta", label: "Button", url: "#" }]);
        break;
      case "divider":
        setBlocks([...blocks, { type: "divider" }]);
        break;
      case "header":
        setBlocks([...blocks, { type: "header" }]);
        break;
      case "socials":
        setBlocks([...blocks, { type: "socials" }]);
        break;
    }
  };

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const updateBlock = (index: number, updates: Partial<EmailBlock>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates } as any;
    setBlocks(newBlocks);
  };

  const handleSave = async () => {
    if (!settings.name || !settings.subject_line) {
      toast.error("Please fill in the campaign name and subject line.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCampaign({
        ...settings,
        content_html: previewHtml,
        status: "draft",
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Campaign created successfully!");
        router.push("/admin/campaigns");
      }
    } catch (err) {
      toast.error("Failed to save campaign.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/campaigns">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-serif text-foreground">
            Create Campaign
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="uppercase tracking-widest text-xs h-10 border-border text-foreground hover:bg-accent"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-xs h-10"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Draft"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Side */}
        <div className="space-y-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-serif">
                Campaign Settings
              </CardTitle>
              <CardDescription>
                Internal name and email subject details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name (Internal)</Label>
                <Input
                  id="name"
                  placeholder="March New Arrivals"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings({ ...settings, name: e.target.value })
                  }
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  placeholder="Discover our new spring collection ✨"
                  value={settings.subject_line}
                  onChange={(e) =>
                    setSettings({ ...settings, subject_line: e.target.value })
                  }
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preview">Preview Text (Optional)</Label>
                <Input
                  id="preview"
                  placeholder="Elevate your style with Elita's latest..."
                  value={settings.preview_text}
                  onChange={(e) =>
                    setSettings({ ...settings, preview_text: e.target.value })
                  }
                  className="bg-background border-border"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-foreground">
                Email Blocks
              </h3>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-border"
                  onClick={() => addBlock("text")}
                  title="Add Text"
                >
                  <Type className="h-4 w-4 text-foreground" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-border"
                  onClick={() => addBlock("hero")}
                  title="Add Hero"
                >
                  <ImageIcon className="h-4 w-4 text-foreground" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-border"
                  onClick={() => addBlock("cta")}
                  title="Add Button"
                >
                  <MousePointer2 className="h-4 w-4 text-foreground" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-border"
                  onClick={() => addBlock("divider")}
                  title="Add Divider"
                >
                  <Minus className="h-4 w-4 text-foreground" />
                </Button>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {blocks.map((block, idx) => (
                <Card
                  key={idx}
                  className="bg-card border-border shadow-sm group"
                >
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBlock(idx)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      {block.type === "header" && (
                        <Layout className="h-3 w-3" />
                      )}
                      {block.type === "text" && <Type className="h-3 w-3" />}
                      {block.type === "hero" && (
                        <ImageIcon className="h-3 w-3" />
                      )}
                      {block.type === "cta" && (
                        <MousePointer2 className="h-3 w-3" />
                      )}
                      {block.type}
                    </div>

                    {block.type === "text" && (
                      <Textarea
                        value={block.content}
                        onChange={(e) =>
                          updateBlock(idx, { content: e.target.value })
                        }
                        className="bg-background border-border min-h-[100px]"
                      />
                    )}

                    {block.type === "hero" && (
                      <div className="grid grid-cols-1 gap-3">
                        <Input
                          placeholder="Image URL"
                          value={block.imageUrl}
                          onChange={(e) =>
                            updateBlock(idx, { imageUrl: e.target.value })
                          }
                          className="bg-background border-border"
                        />
                        <Input
                          placeholder="Hero Title"
                          value={block.title}
                          onChange={(e) =>
                            updateBlock(idx, { title: e.target.value })
                          }
                          className="bg-background border-border"
                        />
                        <Input
                          placeholder="Subtitle (Optional)"
                          value={block.subtitle || ""}
                          onChange={(e) =>
                            updateBlock(idx, { subtitle: e.target.value })
                          }
                          className="bg-background border-border"
                        />
                      </div>
                    )}

                    {block.type === "cta" && (
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Button Label"
                          value={block.label}
                          onChange={(e) =>
                            updateBlock(idx, { label: e.target.value })
                          }
                          className="bg-background border-border"
                        />
                        <Input
                          placeholder="URL"
                          value={block.url}
                          onChange={(e) =>
                            updateBlock(idx, { url: e.target.value })
                          }
                          className="bg-background border-border"
                        />
                      </div>
                    )}

                    {block.type === "divider" && (
                      <div className="py-2">
                        <hr className="border-border border-t" />
                      </div>
                    )}

                    {(block.type === "header" || block.type === "socials") && (
                      <p className="text-xs text-muted-foreground italic">
                        Auto-generated based on brand settings.
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Side */}
        <div className="bg-white border-border border rounded-lg shadow-inner overflow-hidden flex flex-col min-h-[800px]">
          <div className="bg-muted/30 border-b border-border p-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/50" />
              <div className="w-3 h-3 rounded-full bg-amber-400/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/50" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Email Preview
            </span>
            <div className="w-10"></div>
          </div>
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
            <div
              className="bg-white mx-auto shadow-sm"
              style={{ width: "100%", maxWidth: "600px" }}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
