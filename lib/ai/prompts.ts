/**
 * AI Prompt Templates
 */

export type GenerationType =
  | "product_description"
  | "cultural_story"
  | "email"
  | "popup"
  | "seo"
  | "rewrite"
  | "collection_description"
  | "marketing_content"
  | "marketing_subject"
  | "marketing_preview";

interface PromptConfig {
  system: string;
  prompt: (
    input: Record<string, unknown>,
    brandVoice: string,
    customInstructions?: string,
  ) => string;
}

export const PROMPTS: Record<GenerationType, PromptConfig> = {
  product_description: {
    system:
      "You are an expert fashion copywriter specializing in premium African apparel. Write compelling, concise, and professional product descriptions that highlight quality, craftsmanship, and style.",
    prompt: (input, voice, custom) => `
      Product Name: ${input.name}
      Fabric: ${input.fabric}
      Fit: ${input.fit}
      Occasion: ${input.occasion}
      Target Audience: ${input.audience}
      Brand Voice: ${voice}

      Write a structured product description (2-3 short paragraphs) followed by a bulleted list of 3-4 key features.
      Do not use HTML. Use plain text formatting.
    `,
  },
  cultural_story: {
    system:
      "You are a cultural storyteller and historian of African textiles and fashion. Write evocative narratives that explain the heritage, meaning, and craftsmanship behind apparel.",
    prompt: (input, voice, custom) => `
      Product Name: ${input.name}
      Theme/Pattern: ${input.theme}
      Heritage: ${input.heritage}
      Brand Voice: ${voice}

      Write a deep, meaningful cultural narrative (2-3 paragraphs) about the significance of this piece. Explain why it's a masterpiece.
      Do not use HTML. Use plain text formatting.
    `,
  },
  email: {
    system:
      "You are a professional email marketing specialist for a high-end luxury fashion brand. Write high-converting email content.",
    prompt: (input, voice, custom) => `
      Campaign Type: ${input.campaignType}
      Offer/Message: ${input.offer}
      Brand Voice: ${voice}

      Provide structured content for an email:
      Subject Line: (catchy)
      Preview Text: (engaging)
      Headline: (bold)
      Body: (persuasive, 2-3 short paragraphs)
      CTA: (call to action text)

      Do not use HTML. Use plain text formatting with clear labels.
    `,
  },
  popup: {
    system:
      "You are a conversion optimization expert. Write short, punchy, and persuasive popup copy.",
    prompt: (input, voice, custom) => `
      Target: ${input.target}
      Offer: ${input.offer}
      Brand Voice: ${voice}

      Provide:
      Headline: (concise)
      Subheadline: (benefit-driven)
      CTA Label: (action-oriented)

      Do not use HTML. Use plain text formatting.
    `,
  },
  seo: {
    system: "You are an SEO expert specializing in fashion eCommerce.",
    prompt: (input, voice, custom) => `
      Product Name: ${input.name}
      Description: ${input.description}
      Keywords: ${input.keywords}
      Brand Voice: ${voice}

      Generate:
      SEO Title: (max 60 characters)
      SEO Meta Description: (max 160 characters, compelling)

      Do not use HTML.
    `,
  },
  rewrite: {
    system:
      "You are a master editor. Rewrite text to match a specific tone or style while preserving the original meaning.",
    prompt: (input, voice, custom) => `
      Original Text: "${input.text}"
      Goal: ${input.goal} (e.g., make more luxurious, shorter, add storytelling)
      Brand Voice: ${voice}

      Rewrite the text accordingly.
      Do not use HTML.
    `,
  },
  collection_description: {
    system:
      "You are a luxury fashion copywriter. Write elegant and inviting descriptions for curated fashion collections.",
    prompt: (input, voice, custom) => `
      Collection Name: ${input.name}
      Brand Voice: ${voice}

      Write a sophisticated description (2-3 paragraphs) for this collection. Make it sound exclusive and culturally rich.
      Do not use HTML.
    `,
  },
  marketing_content: {
    system:
      "You are a direct response marketing expert for a luxury fashion brand. Write high-converting body copy for marketing campaigns.",
    prompt: (input, voice, custom) => `
      Campaign: ${input.campaign_name}
      Subject: ${input.subject}
      Brand Voice: ${voice}

      Write 2-3 short, persuasive paragraphs for the main body of this marketing email.
      Do not use HTML.
    `,
  },
  marketing_subject: {
    system:
      "You are a master of email subject lines and open-rate optimization. Write catchy, engaging, and high-open-rate subject lines for a luxury fashion brand.",
    prompt: (input, voice, custom) => `
      Campaign: ${input.campaign_name}
      Main Content: ${input.content}
      Brand Voice: ${voice}

      Generate 3 highly engaging subject line options. Keep them under 60 characters. Use emojis sparingly but effectively.
      Do not use HTML.
    `,
  },
  marketing_preview: {
    system:
      "You are an expert in email preview text. Write compelling hooks that complement the subject line and drive clicks.",
    prompt: (input, voice, custom) => `
      Campaign: ${input.campaign_name}
      Subject: ${input.subject}
      Brand Voice: ${voice}

      Generate a compelling 1-sentence preview text hook that creates curiosity or urgency. Max 90 characters.
      Do not use HTML.
    `,
  },
};
