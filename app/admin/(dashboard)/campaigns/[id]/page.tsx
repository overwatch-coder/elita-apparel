"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Send,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  getCampaignById,
  deleteCampaign,
  sendCampaign,
} from "@/lib/actions/campaigns";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSendConfirm, setShowSendConfirm] = useState(false);

  useEffect(() => {
    async function loadCampaign() {
      const result = await getCampaignById(id);
      if (result.error) {
        toast.error(result.error);
        router.push("/admin/campaigns");
      } else {
        setCampaign(result.campaign);
      }
      setIsLoading(false);
    }
    loadCampaign();
  }, [id, router]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteCampaign(id);
    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success("Campaign deleted");
      router.push("/admin/campaigns");
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      const result = await sendCampaign(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Campaign sent successfully!");
        // Reload to show sent status
        const updated = await getCampaignById(id);
        setCampaign(updated.campaign);
      }
    } catch (err) {
      toast.error("Failed to send campaign.");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Campaign?"
        description="Are you sure you want to delete this campaign? This action cannot be undone."
        variant="destructive"
        confirmText="Delete"
      />
      <ConfirmDialog
        open={showSendConfirm}
        onOpenChange={setShowSendConfirm}
        onConfirm={handleSend}
        title="Blast Campaign?"
        description="Ready to blast this campaign to all active subscribers? This cannot be undone."
        variant="default"
        confirmText="Send Now"
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/campaigns">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-serif text-foreground">
              {campaign.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                className={cn(
                  "capitalize",
                  campaign.status === "sent"
                    ? "bg-ghana-green text-white"
                    : campaign.status === "scheduled"
                      ? "bg-gold text-white"
                      : "bg-muted text-foreground",
                )}
              >
                {campaign.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Created on{" "}
                {format(new Date(campaign.created_at), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {campaign.status === "draft" && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting || isSending}
                className="border-border text-destructive hover:bg-destructive/10 uppercase tracking-widest text-xs h-10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button
                onClick={() => setShowSendConfirm(true)}
                disabled={isSending}
                className="bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-xs h-10"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSending ? "Sending..." : "Send Campaign Now"}
              </Button>
            </>
          )}
          {campaign.status === "sent" && (
            <Button
              variant="outline"
              disabled
              className="border-border text-ghana-green uppercase tracking-widest text-xs h-10"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Campaign Sent
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-serif">
                Email Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-widest">
                  Subject Line
                </Label>
                <p className="text-foreground font-medium mt-1">
                  {campaign.subject_line}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-widest">
                  Preview Text
                </Label>
                <p className="text-muted-foreground mt-1">
                  {campaign.preview_text || "None set"}
                </p>
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {campaign.status === "sent" ? (
                    <>
                      <Clock className="h-4 w-4" />
                      Sent on{" "}
                      {format(new Date(campaign.sent_at), "MMM d, h:mm a")}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Currently in Draft status.
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {campaign.status === "sent" && (
            <Card className="bg-card border-border shadow-sm border-l-4 border-l-ghana-green">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 bg-ghana-green/10 text-ghana-green rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Success!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Emails were dispatched via Nodemailer/SMTP.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Campaign Preview Area */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Content Preview
                </CardTitle>
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold border-border"
                >
                  Desktop View
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 bg-slate-50 min-h-[600px] flex justify-center">
              <div
                className="bg-white my-8 mx-auto shadow-xl w-full max-w-[600px] pointer-events-none select-none"
                dangerouslySetInnerHTML={{ __html: campaign.content_html }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
