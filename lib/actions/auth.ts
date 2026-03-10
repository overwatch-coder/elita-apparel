"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { triggerMarketingAutomation } from "@/lib/marketing/triggers";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (user) {
    // Check role from profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Login profile fetch error:", profileError);
    }

    if (profile?.role === "admin") {
      return redirect("/admin");
    }
  }

  return redirect("/account");
}

export async function logoutAction(redirectPath = "/login") {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(redirectPath);
}

// ── Customer Auth Actions ────────────────────────────────────────

export async function signupCustomerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password || !fullName) {
    return { error: "All fields are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Trigger Marketing Automation
  try {
    await triggerMarketingAutomation("signup", {
      email,
      name: fullName,
    });
  } catch (triggerErr) {
    console.error("Signup automation trigger error:", triggerErr);
  }

  // Usually email confirmation is required, but if disabled or after sign up we redirect to account
  // redirect("/account");
  return { success: true, email };
}

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  const supabase = await createClient();

  // Gets origin for the reset link
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password reset instructions sent to your email." };
}

export async function updatePasswordAction(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Verify current password
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (authError) {
    return { error: "Invalid current password" };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password updated successfully" };
}

// ── Secure Account Update Actions ────────────────────────────────

import { sendVerificationCodeEmail } from "@/lib/mail";

/**
 * Initiates an email change by verifying current password and sending an OTP
 */
export async function initiateEmailChange(formData: FormData) {
  const newEmail = formData.get("newEmail") as string;
  const currentPassword = formData.get("currentPassword") as string;

  if (!newEmail || !currentPassword) {
    return { error: "Both fields are required" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // 1. Verify current password by signing in
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (authError) return { error: "Invalid password confirmation" };

  // 2. Generate 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

  // 3. Save OTP to database
  const { error: dbError } = await supabase.from("verification_codes").insert({
    user_id: user.id,
    code,
    type: "email_change",
    metadata: { new_email: newEmail },
    expires_at: expiresAt,
  });

  if (dbError) return { error: "Failed to generate verification code" };

  // 4. Send email
  await sendVerificationCodeEmail(newEmail, code, "email_change");

  return {
    success: true,
    message: "Verification code sent to your new email.",
  };
}

/**
 * Confirms an email change using the OTP
 */
export async function confirmEmailChange(otp: string) {
  if (!otp || otp.length !== 6) return { error: "Invalid verification code" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // 1. Find and verify OTP
  const { data: codeData, error: fetchError } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("user_id", user.id)
    .eq("code", otp)
    .eq("type", "email_change")
    .gt("expires_at", new Date().toISOString())
    .single();

  if (fetchError || !codeData)
    return { error: "Invalid or expired verification code" };

  if (!codeData.metadata || typeof codeData.metadata !== "object") {
    return { error: "Invalid verification data" };
  }

  const metadata = codeData.metadata as { new_email?: string };
  const newEmail = metadata.new_email;

  if (!newEmail) return { error: "Missing new email in verification" };

  // 2. Update user email in Auth
  const { error: updateError } = await supabase.auth.updateUser({
    email: newEmail,
  });

  if (updateError) return { error: updateError.message };

  // 3. Delete used code
  await supabase.from("verification_codes").delete().eq("id", codeData.id);

  return {
    success: true,
    message: "Email updated successfully. Please verify your new email.",
  };
}

/**
 * Initiates a password change by sending an OTP
 */
export async function initiatePasswordChange(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;

  if (!currentPassword) return { error: "Current password is required" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // 1. Verify current password
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (authError) return { error: "Invalid current password" };

  // 2. Generate OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  // 3. Save OTP
  const { error: dbError } = await supabase.from("verification_codes").insert({
    user_id: user.id,
    code,
    type: "password_change",
    expires_at: expiresAt,
  });

  if (dbError) return { error: "Failed to generate verification code" };

  // 4. Send email
  await sendVerificationCodeEmail(user.email!, code, "password_change");

  return { success: true, message: "Verification code sent to your email." };
}

/**
 * Confirms a password change using OTP
 */
export async function confirmPasswordChange(otp: string, newPassword: string) {
  if (!otp || otp.length !== 6) return { error: "Invalid code" };
  if (!newPassword || newPassword.length < 6)
    return { error: "Password too short" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // 1. Verify OTP
  const { data: codeData, error: fetchError } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("user_id", user.id)
    .eq("code", otp)
    .eq("type", "password_change")
    .gt("expires_at", new Date().toISOString())
    .single();

  if (fetchError || !codeData)
    return { error: "Invalid or expired verification code" };

  // 2. Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) return { error: updateError.message };

  // 3. Delete used code
  await supabase.from("verification_codes").delete().eq("id", codeData.id);

  return { success: true, message: "Password updated successfully." };
}
