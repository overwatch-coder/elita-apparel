"use client";

import { useState, useEffect, use } from "react";
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
import { ArrowLeft, Mail, Plus, Trash2, Save, Clock, Zap } from "lucide-react";
import {
  getAutomations,
  updateAutomationFlow,
} from "@/lib/actions/automations";
import { toast } from "sonner";
import Link from "next/link";

export default function AutomationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [automation, setAutomation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { automations } = await getAutomations();
      const flow = automations?.find((a: any) => a.id === id);
      if (flow) {
        setAutomation(flow);
      } else {
        toast.error("Flow not found");
        router.push("/admin/automations");
      }
      setIsLoading(false);
    }
    load();
  }, [id, router]);

  const addEmail = () => {
    const newEmails = [
      ...(automation.automation_emails || []),
      {
        subject_line: "New Email",
        content_html: "<p>Hello {{NAME}},</p>",
        delay_minutes: 0,
      },
    ];
    setAutomation({ ...automation, automation_emails: newEmails });
  };

  const updateEmail = (index: number, updates: any) => {
    const newEmails = [...automation.automation_emails];
    newEmails[index] = { ...newEmails[index], ...updates };
    setAutomation({ ...automation, automation_emails: newEmails });
  };

  const removeEmail = (index: number) => {
    const newEmails = automation.automation_emails.filter(
      (_: any, i: number) => i !== index,
    );
    setAutomation({ ...automation, automation_emails: newEmails });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateAutomationFlow(
        id,
        automation.automation_emails,
      );
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Flow updated successfully");
      }
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-20 text-center animate-pulse">Loading flow...</div>
    );
  if (!automation) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/automations">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-serif text-foreground">
              {automation.name}
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              Trigger: {automation.trigger_event}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gold hover:bg-gold-dark text-white font-medium uppercase tracking-widest text-xs h-12"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif text-foreground">Email Sequence</h2>
          <Button
            onClick={addEmail}
            variant="outline"
            className="border-gold text-gold hover:bg-gold/5 uppercase tracking-widest text-[10px] h-9"
          >
            <Plus className="mr-2 h-3.3 w-3.5" />
            Add Email to Flow
          </Button>
        </div>

        <div className="space-y-6">
          {automation.automation_emails
            ?.sort((a: any, b: any) => a.delay_minutes - b.delay_minutes)
            .map((email: any, idx: number) => (
              <Card
                key={idx}
                className="bg-card border-border shadow-sm border-l-4 border-l-gold relative"
              >
                <div className="absolute right-4 top-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEmail(idx)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <CardTitle className="text-base font-medium">
                      Email step
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Subject Line</Label>
                      <Input
                        value={email.subject_line}
                        onChange={(e) =>
                          updateEmail(idx, { subject_line: e.target.value })
                        }
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delay (minutes)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={email.delay_minutes}
                          onChange={(e) =>
                            updateEmail(idx, {
                              delay_minutes: parseInt(e.target.value) || 0,
                            })
                          }
                          className="bg-background border-border w-24"
                        />
                        <span className="text-xs text-muted-foreground italic">
                          {email.delay_minutes === 0
                            ? "Send immediately"
                            : `${Math.round(email.delay_minutes / 60)} hours later`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Content (HTML)</Label>
                    <Textarea
                      value={email.content_html}
                      onChange={(e) =>
                        updateEmail(idx, { content_html: e.target.value })
                      }
                      className="bg-background border-border font-mono text-sm min-h-[200px]"
                      placeholder="Use {{NAME}} for personalization."
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Tip: Use {`{{NAME}}`}, {`{{EMAIL}}`}, and {`{{ORDER_ID}}`}{" "}
                      as placeholders.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          {(!automation.automation_emails ||
            automation.automation_emails.length === 0) && (
            <div className="text-center p-12 bg-muted/20 border border-dashed border-border rounded-lg">
              <Mail className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground text-sm">
                No emails in this sequence yet.
              </p>
              <Button
                onClick={addEmail}
                variant="link"
                className="text-gold mt-2"
              >
                Create the first email
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
