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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { AIGeneratorButton } from "@/components/admin/ai-generator-button";
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
  ChevronUp,
  ChevronDown,
  Monitor,
  Smartphone,
  RotateCcw,
} from "lucide-react";
import { AIRewriteButton } from "@/components/admin/ai-rewrite-button";
import {
  generateCampaignHtml,
  type EmailBlock,
} from "@/lib/marketing/templates";
import { createCampaign } from "@/lib/actions/campaigns";
import { getProducts } from "@/lib/actions/products";
import { toast } from "sonner";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );

  const [settings, setSettings] = useState({
    name: "",
    subject_line: "",
    preview_text: "",
  });

  useEffect(() => {
    async function fetchProducts() {
      const { products } = await getProducts();
      if (products) setAvailableProducts(products);
    }
    fetchProducts();
  }, []);

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
      case "product_grid":
        setBlocks([...blocks, { type: "product_grid", productIds: [] }]);
        break;
    }
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...blocks];
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    [newBlocks[index], newBlocks[newIdx]] = [
      newBlocks[newIdx],
      newBlocks[index],
    ];
    setBlocks(newBlocks);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/campaigns">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-serif text-foreground">
            Create Campaign
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none uppercase tracking-widest text-[10px] h-10 border-border text-foreground hover:bg-accent"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-[10px] h-10"
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <div className="flex items-center gap-2">
                    <AIGeneratorButton
                      type="marketing_subject"
                      input={{
                        campaign_name: settings.name,
                        content: blocks
                          .filter((b) => b.type === "text")
                          .map((b: any) => b.content)
                          .join(" "),
                      }}
                      onGenerated={(text) => {
                        // Extract first line if multiple options given
                        const subject = text
                          .split("\n")[0]
                          .replace(/^\d\.\s*/, "")
                          .replace(/^["']|["']$/g, "");
                        setSettings({ ...settings, subject_line: subject });
                      }}
                      label="AI Subject"
                      size="sm"
                      className="flex-1 sm:flex-none"
                    />
                    <AIRewriteButton
                      text={settings.subject_line}
                      onRewrite={(text) =>
                        setSettings({ ...settings, subject_line: text })
                      }
                      className="flex-1 sm:flex-none"
                    />
                  </div>
                </div>
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <Label htmlFor="preview">Preview Text (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <AIGeneratorButton
                      type="marketing_preview"
                      input={{
                        campaign_name: settings.name,
                        subject: settings.subject_line,
                      }}
                      onGenerated={(text) =>
                        setSettings({ ...settings, preview_text: text })
                      }
                      label="AI Preview"
                      size="sm"
                      className="flex-1 sm:flex-none"
                    />
                    <AIRewriteButton
                      text={settings.preview_text}
                      onRewrite={(text) =>
                        setSettings({ ...settings, preview_text: text })
                      }
                      className="flex-1 sm:flex-none"
                    />
                  </div>
                </div>
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
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 border-border"
                  onClick={() => addBlock("product_grid")}
                  title="Add Product Grid"
                >
                  <Layout className="h-4 w-4 text-foreground" />
                </Button>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {blocks.map((block, idx) => (
                <Card
                  key={idx}
                  className="bg-card border-border shadow-sm group"
                >
                  <CardHeader className="p-3 pb-0 border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
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
                        {block.type === "product_grid" && (
                          <Layout className="h-3 w-3" />
                        )}
                        {block.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveBlock(idx, "up")}
                          disabled={idx === 0}
                          className="h-7 w-7 text-muted-foreground"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveBlock(idx, "down")}
                          disabled={idx === blocks.length - 1}
                          className="h-7 w-7 text-muted-foreground"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBlock(idx)}
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-3 space-y-4">
                    {block.type === "text" && (
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                          <div className="flex items-center gap-2">
                            <AIGeneratorButton
                              type="marketing_content"
                              input={{
                                campaign_name: settings.name,
                                subject: settings.subject_line,
                              }}
                              onGenerated={(text) =>
                                updateBlock(idx, { content: text })
                              }
                              label="Generate"
                              size="sm"
                              className="flex-1 sm:flex-none"
                            />
                            <AIRewriteButton
                              text={block.content}
                              onRewrite={(text) =>
                                updateBlock(idx, { content: text })
                              }
                              className="flex-1 sm:flex-none"
                            />
                          </div>
                        </div>
                        <RichTextEditor
                          value={block.content}
                          onChange={(text) =>
                            updateBlock(idx, { content: text })
                          }
                          placeholder="Write your email content..."
                        />
                      </div>
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

                    {block.type === "product_grid" && (
                      <div className="space-y-3">
                        <Label>Select Products (Max 4)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between border-border bg-background"
                            >
                              Add a product...
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[300px] p-0 shadow-lg border-border"
                            align="start"
                          >
                            <Command>
                              <CommandInput placeholder="Search products..." />
                              <CommandList>
                                <CommandEmpty>No product found.</CommandEmpty>
                                <CommandGroup>
                                  {availableProducts.map((product) => (
                                    <CommandItem
                                      key={product.id}
                                      value={product.name}
                                      onSelect={() => {
                                        if (block.productIds.length >= 4) {
                                          toast.error(
                                            "Max 4 products allowed in a grid.",
                                          );
                                          return;
                                        }
                                        if (
                                          block.productIds.includes(product.id)
                                        ) {
                                          toast.error("Product already added.");
                                          return;
                                        }

                                        const newIds = [
                                          ...block.productIds,
                                          product.id,
                                        ];
                                        const hydratedProducts =
                                          availableProducts
                                            .filter((p) =>
                                              newIds.includes(p.id),
                                            )
                                            .map((p) => ({
                                              id: p.id,
                                              name: p.name,
                                              price: p.price,
                                              imageUrl:
                                                p.product_images?.[0]
                                                  ?.image_url || "",
                                              slug: p.slug,
                                            }));

                                        updateBlock(idx, {
                                          productIds: newIds,
                                          products: hydratedProducts,
                                        });
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          block.productIds.includes(product.id)
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {product.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {block.productIds.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {block.productIds.map((pid) => {
                              const p = availableProducts.find(
                                (prod) => prod.id === pid,
                              );
                              return (
                                <div
                                  key={pid}
                                  className="flex items-center gap-1 bg-accent/10 border border-border px-2 py-1 rounded text-xs"
                                >
                                  <span>{p?.name}</span>
                                  <button
                                    onClick={() => {
                                      const newIds = block.productIds.filter(
                                        (id) => id !== pid,
                                      );
                                      const hydratedProducts = availableProducts
                                        .filter((p) => newIds.includes(p.id))
                                        .map((p) => ({
                                          id: p.id,
                                          name: p.name,
                                          price: p.price,
                                          imageUrl:
                                            p.product_images?.[0]?.image_url ||
                                            "",
                                          slug: p.slug,
                                        }));
                                      updateBlock(idx, {
                                        productIds: newIds,
                                        products: hydratedProducts,
                                      });
                                    }}
                                    className="hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
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
        <div className="bg-white border-border border rounded-lg shadow-inner overflow-hidden flex flex-col min-h-[800px] sticky top-6">
          <div className="bg-muted/30 border-b border-border p-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="flex bg-muted/50 p-1 rounded-md border border-border">
              <Button
                variant={previewMode === "desktop" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-[10px] uppercase tracking-wider px-3"
                onClick={() => setPreviewMode("desktop")}
              >
                <Monitor className="h-3 w-3 mr-1.5" />
                Desktop
              </Button>
              <Button
                variant={previewMode === "mobile" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-[10px] uppercase tracking-wider px-3"
                onClick={() => setPreviewMode("mobile")}
              >
                <Smartphone className="h-3 w-3 mr-1.5" />
                Mobile
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => setPreviewHtml(generateCampaignHtml(blocks))}
              title="Refresh Preview"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto bg-slate-50 p-8 custom-scrollbar">
            <div
              className={cn(
                "bg-white mx-auto shadow-2xl transition-all duration-300",
                previewMode === "mobile" ? "max-w-[375px]" : "max-w-[600px]",
              )}
              style={{ width: "100%" }}
            >
              <div
                className="bg-white p-0 pointer-events-none select-none overflow-hidden"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
