"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/** Fetch the current user's onboarding state from their profile */
export async function getOnboardingStatus() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("onboarding_completed, onboarding_step, role")
    .eq("id", user.id)
    .single();

  if (error || !profile) return null;

  return {
    onboarding_completed: profile.onboarding_completed,
    onboarding_step: profile.onboarding_step ?? 0,
    role: profile.role,
  };
}

/** Persist the current step mid-tour so users can resume after navigation */
export async function saveOnboardingStep(step: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_step: step })
    .eq("id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

/** Mark onboarding as finished (completed = true, step = null) */
export async function completeOnboarding() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true, onboarding_step: null })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/account");
  return { success: true };
}

/** Reset onboarding so the tour launches again */
export async function resetOnboarding() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_completed: false, onboarding_step: 0 })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/account");
  return { success: true };
}
