import { getAutomations, toggleAutomation } from "@/lib/actions/automations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Zap, Mail, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AutomationToggle } from "./automation-toggle";
import { CreateAutomationDialog } from "./create-automation-dialog";

export const metadata = {
  title: "Automations | Admin",
  description: "Set up and manage automated email sequences.",
};

export default async function AutomationsDashboardPage() {
  const { automations, error } = await getAutomations();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-foreground">
            Lifecycle Automations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure "set-it-and-forget-it" email sequences triggered by
            customer actions.
          </p>
        </div>
        <CreateAutomationDialog />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {error ? (
          <div className="p-6 text-center text-destructive bg-card border border-border rounded-lg">
            <p>Error loading automations: {error}</p>
          </div>
        ) : !automations || automations.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center bg-card border border-border rounded-lg">
            <div className="h-16 w-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-6">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-serif text-foreground mb-2">
              No automations configured
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-8">
              Database setup required. Please ensure the migration for marketing
              tables has been run.
            </p>
          </div>
        ) : (
          automations.map((flow: any) => (
            <Card
              key={flow.id}
              className="bg-card border-border shadow-sm overflow-hidden"
            >
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
                <div className="space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <CardTitle className="text-xl font-serif">
                      {flow.name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase font-bold tracking-tight shrink-0"
                    >
                      Trigger: {flow.trigger_event.replace("_", " ")}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 sm:line-clamp-none">
                    {flow.trigger_event === "signup" &&
                      "Sent when a new user signs up or subscribes."}
                    {flow.trigger_event === "order_placed" &&
                      "Sent after a customer completes a purchase."}
                    {flow.trigger_event === "abandoned_cart" &&
                      "Sent to users who leave items in their cart."}
                  </CardDescription>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest shrink-0">
                      {flow.active ? "Active" : "Inactive"}
                    </span>
                    <AutomationToggle
                      id={flow.id}
                      initialActive={flow.active}
                    />
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-gold hover:text-gold-dark h-9 px-0 sm:px-3"
                  >
                    <Link href={`/admin/automations/${flow.id}`}>
                      Configure <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-8 items-start">
                  {flow.automation_emails &&
                  flow.automation_emails.length > 0 ? (
                    flow.automation_emails
                      .sort(
                        (a: any, b: any) => a.delay_minutes - b.delay_minutes,
                      )
                      .map((email: any, idx: number) => (
                        <div key={email.id} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className="h-10 w-10 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center text-gold font-serif text-lg">
                              {idx + 1}
                            </div>
                            {idx < flow.automation_emails.length - 1 && (
                              <div className="w-px h-12 bg-border my-2" />
                            )}
                          </div>
                          <div className="space-y-1 py-1">
                            <p className="text-sm font-medium text-foreground">
                              {email.subject_line}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                {email.delay_minutes === 0
                                  ? "Immediately"
                                  : email.delay_minutes < 60
                                    ? `${email.delay_minutes} min delay`
                                    : `${Math.round(email.delay_minutes / 60)} hour delay`}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="py-4 text-center w-full italic text-muted-foreground text-sm">
                      No emails configured for this flow yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
