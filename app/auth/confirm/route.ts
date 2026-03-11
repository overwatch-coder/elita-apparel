import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/account/profile";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      if (type === "email_change") {
        // Successful verification of one of the links in a double opt-in email change flow.
        // Redirect with a success message.
        redirect(
          `${next}?message=Email+Change+Verification+Successful.+If+you+haven't+already,+please+check+your+other+inbox+to+confirm+the+second+link.`
        );
      } else {
        redirect(`${next}?message=Verification+Successful`);
      }
    } else {
      // Redirect with the specific error message
      redirect(`${next}?error=Verification+Failed&error_description=${encodeURIComponent(error.message)}`);
    }
  }

  // Redirect if no token hash was found
  redirect(`${next}?error=Invalid+Link&error_description=The+verification+link+is+invalid+or+missing+parameters.`);
}
