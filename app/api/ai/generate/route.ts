import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { aiGenerateText } from "@/lib/ai";
import { PROMPTS, GenerationType } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, {
        status: 401,
      } as any);
    }

    const body = await req.json();
    const { type, input, tone, customInstructions } = body as {
      type: GenerationType;
      input: any;
      tone?: string;
      customInstructions?: string;
    };

    if (!type || !input) {
      return NextResponse.json({ error: "Invalid request" }, {
        status: 400,
      } as any);
    }

    const promptConfig = PROMPTS[type];
    if (!promptConfig) {
      return NextResponse.json({ error: "Unsupported generation type" }, {
        status: 400,
      } as any);
    }

    // 1. Fetch Brand Voice (if not provided in payload)
    let brandVoice = tone;
    if (!brandVoice) {
      const { data: brandSettings } = await supabase
        .from("brand_settings")
        .select("brand_voice")
        .single();
      brandVoice = brandSettings?.brand_voice || "Luxury";
    }

    // 2. Build Prompt
    const promptText = promptConfig.prompt(
      input,
      brandVoice!,
      customInstructions,
    );
    const systemPrompt = promptConfig.system;

    // 3. Generate Content
    const { text, error, providerUsed } = await aiGenerateText({
      prompt: promptText,
      system: systemPrompt,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 } as any);
    }

    // 4. Log Generation
    await supabase.from("ai_generations").insert({
      type,
      input_data: input,
      output_text: text,
      model_used: providerUsed || process.env.AI_SERVICE_TYPE || "openai",
    });

    return NextResponse.json({ text, provider: providerUsed });
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 } as any,
    );
  }
}
