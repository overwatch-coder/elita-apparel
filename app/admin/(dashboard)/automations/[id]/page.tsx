"use client";

import { useState, useEffect, use as useReact } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Plus, Trash2, Save, Zap, Clock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { AIGeneratorButton } from "@/components/admin/ai-generator-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import {
  getAutomations,
  updateAutomationFlow,
  deleteAutomation,
} from "@/lib/actions/automations";

export default function AutomationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = useReact(params);
  const id = resolvedParams.id;

  const [automation, setAutomation] = useState<any>(null);
  const [conditions, setConditions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { automations } = await getAutomations();
        const flow = automations?.find((a: any) => a.id === id);
        if (flow) {
          setAutomation(flow);
          setConditions((flow.trigger_conditions as any[]) || []);
        } else {
          toast.error("Flow not found");
          router.push("/admin/automations");
        }
      } catch (err) {
        toast.error("Failed to load automation");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id, router]);

  const handleDelete = async () => {
    try {
      const result = await deleteAutomation(id);
      if (result.success) {
        toast.success("Automation deleted");
        router.push("/admin/automations");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete automation");
      }
    } catch (err) {
      toast.error("An error occurred during deletion");
    }
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      { field: "order_total", operator: "gt", value: "0" },
    ]);
  };

  const updateCondition = (index: number, updates: any) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    setConditions(newConditions);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

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
        conditions,
      );
      if (result.success) {
        toast.success("Flow updated successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save changes");
      }
    } catch (err) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20 animate-pulse">
        <Mail className="h-8 w-8 text-gold mr-3 animate-bounce" />
        <span className="text-xl font-serif">Loading flow...</span>
      </div>
    );
  }

  if (!automation) return null;

  return (
    <>
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Automation Flow?"
        description="This will permanently delete this automation and all its associated emails. This action cannot be undone."
        variant="destructive"
        confirmText="Delete Flow"
      />

      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="shrink-0 -ml-2"
            >
              <Link href="/admin/automations">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif text-foreground leading-tight">
                {automation.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center">
                  <Zap className="h-3 w-3 mr-1 text-gold" />
                  Trigger: {automation.trigger_event}
                </span>
                <span className="hidden sm:inline text-muted-foreground/30">
                  •
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                  {automation.automation_emails?.length || 0} Steps
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 sm:flex-none text-destructive border-destructive/20 hover:bg-destructive/5 uppercase tracking-widest text-[9px] sm:text-[10px] h-10 px-4"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Flow
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none bg-gold hover:bg-gold-dark text-white font-medium uppercase tracking-widest text-[9px] sm:text-[10px] h-10 px-6 shadow-sm shadow-gold/20"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Email Sequence */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif text-foreground">
                Email Sequence
              </h2>
              <Button
                onClick={addEmail}
                variant="outline"
                className="border-gold text-gold hover:bg-gold/5 uppercase tracking-widest text-[10px] h-9"
              >
                <Plus className="mr-2 h-3.5 w-3.5" />
                Add Email
              </Button>
            </div>

            <div className="space-y-6">
              {automation.automation_emails
                ?.sort((a: any, b: any) => a.delay_minutes - b.delay_minutes)
                .map((email: any, idx: number) => (
                  <Card
                    key={idx}
                    className="bg-card border-border shadow-sm border-l-4 border-l-gold relative overflow-hidden group"
                  >
                    <div className="absolute right-4 top-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEmail(idx)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/5"
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
                          Email Step
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                            Subject Line
                          </Label>
                          <Input
                            value={email.subject_line}
                            onChange={(e) =>
                              updateEmail(idx, { subject_line: e.target.value })
                            }
                            className="bg-background border-border h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                            Delay
                          </Label>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <Input
                              type="number"
                              value={email.delay_minutes}
                              onChange={(e) =>
                                updateEmail(idx, {
                                  delay_minutes: parseInt(e.target.value) || 0,
                                })
                              }
                              className="bg-background border-border h-10 sm:w-24"
                            />
                            <div className="flex items-center text-[10px] text-muted-foreground italic bg-muted/30 px-3 h-10 rounded-md border border-border/50 flex-1">
                              <Clock className="h-3 w-3 mr-2 opacity-50" />
                              {email.delay_minutes === 0
                                ? "Send immediately"
                                : `${Math.round(email.delay_minutes / 60)} hours after trigger`}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 pt-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                            Email Content
                          </Label>
                          <div className="flex items-center gap-2">
                            <AIGeneratorButton
                              type="email"
                              input={{
                                automation_name: automation.name,
                                trigger: automation.trigger_event,
                                subject: email.subject_line,
                              }}
                              onGenerated={(text) =>
                                updateEmail(idx, { content_html: text })
                              }
                              label="Generate"
                              size="sm"
                              className="flex-1 sm:flex-none"
                            />
                          </div>
                        </div>
                        <RichTextEditor
                          value={email.content_html}
                          onChange={(text) =>
                            updateEmail(idx, { content_html: text })
                          }
                          placeholder="Compose your automated email..."
                        />
                        <div className="bg-muted/30 rounded-md p-3 border border-border/40">
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mb-2 flex items-center">
                            <Zap className="h-3 w-3 mr-1 text-gold" />
                            Personalization Tags
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {["{{NAME}}", "{{EMAIL}}", "{{ORDER_ID}}"].map(
                              (tag) => (
                                <code
                                  key={tag}
                                  className="text-[10px] bg-background px-2 py-0.5 rounded border border-border/50 text-gold"
                                >
                                  {tag}
                                </code>
                              ),
                            )}
                            <span className="text-[10px] text-muted-foreground italic ml-2">
                              and any custom metadata keys
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {(!automation.automation_emails ||
                automation.automation_emails.length === 0) && (
                <div className="text-center p-20 bg-muted/5 border border-dashed border-border/50 rounded-xl space-y-4">
                  <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Mail className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      No emails in this sequence
                    </p>
                    <p className="text-muted-foreground text-xs mt-1 max-w-[250px] mx-auto">
                      Build your automated journey by adding your first email
                      step.
                    </p>
                  </div>
                  <Button
                    onClick={addEmail}
                    className="bg-gold hover:bg-gold-dark text-white uppercase tracking-widest text-[10px] h-10 px-6 mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Step
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area: Settings & Conditions */}
          <div className="space-y-6">
            <h2 className="text-xl font-serif text-foreground">
              Trigger Rules
            </h2>

            <Card className="bg-card border-border shadow-sm border-t-4 border-t-gold">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-gold" />
                  Filter Conditions
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Only trigger this automation if the following rules match. If
                  empty, it fires for every event.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {conditions.map((cond, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-border/60 bg-muted/5 space-y-3 relative group"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCondition(idx)}
                        className="h-6 w-6 absolute -right-2 -top-2 rounded-full border border-border bg-background shadow-sm text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>

                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                          Field
                        </Label>
                        <Select
                          value={cond.field}
                          onValueChange={(v) =>
                            updateCondition(idx, { field: v })
                          }
                        >
                          <SelectTrigger className="h-8 text-[11px] bg-background">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="order_total">
                              Order Total
                            </SelectItem>
                            <SelectItem value="customer_country">
                              Country
                            </SelectItem>
                            <SelectItem value="is_first_purchase">
                              First Purchase
                            </SelectItem>
                            <SelectItem value="product_category">
                              Category
                            </SelectItem>
                            <SelectItem value="source">Source Key</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                            Operator
                          </Label>
                          <Select
                            value={cond.operator}
                            onValueChange={(v) =>
                              updateCondition(idx, { operator: v })
                            }
                          >
                            <SelectTrigger className="h-8 text-[11px] bg-background">
                              <SelectValue placeholder="Logic" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="eq">Equals</SelectItem>
                              <SelectItem value="neq">Not Equals</SelectItem>
                              <SelectItem value="gt">Greater Than</SelectItem>
                              <SelectItem value="lt">Less Than</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                            Value
                          </Label>
                          <Input
                            value={cond.value}
                            onChange={(e) =>
                              updateCondition(idx, { value: e.target.value })
                            }
                            placeholder="Val"
                            className="h-8 text-[11px] bg-background"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {conditions.length === 0 && (
                    <div className="py-6 px-4 text-center border border-dashed border-border/50 rounded-lg bg-muted/5">
                      <p className="text-[11px] text-muted-foreground">
                        Always fires for all{" "}
                        <span className="text-gold font-bold">
                          "{automation.trigger_event}"
                        </span>{" "}
                        events.
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={addCondition}
                  variant="outline"
                  className="w-full border-gold text-gold hover:bg-gold hover:text-white uppercase tracking-widest text-[9px] h-10 transition-colors"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Add New Rule
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted/30 border-border/50 shadow-none border-dashed">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4 text-gold" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wider">
                      Quick Info
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Custom triggers like{" "}
                      <span className="font-mono text-gold-dark">
                        vip_signup
                      </span>{" "}
                      can be triggered by calling our internal API with the
                      corresponding event key.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
