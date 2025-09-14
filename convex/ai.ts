import { v } from "convex/values";
import { action } from "./_generated/server";
import OpenAI from "openai";
import { api } from "./_generated/api";

export const generateDrawingPrompts_simple = action({
    args: {game_id: v.id("game"), themes: v.array(v.string()) },
    handler: async (ctx, args) => {
      
    //const client = new OpenAI();
    
    const { game_id, themes } = args;

    // Build JSON schema for structured output
    const properties: Record<string, any> = {};
    for (const theme of themes) {
      properties[theme] = {
        type: "array",
        description: `10 návrhů pro kreslení pro téma "${theme}"`,
        items: { type: "string" },
        minItems: 10,
        maxItems: 10,
      };
    }

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-4.1-nano-2025-04-14",
    messages: [
      {
        role: "system",
        content: "Jsi asistent, který vytváří návrhy na kreslení pro společenskou hru Pictionary v češtině.",
      },
      {
        role: "user",
        content: `Vytvoř 10 návrhů pro kreslení pro každé z témat. Návrh je pouze ten předmět nebo věc, bez dalších detailů. Nepopisuj žádný děj, prostředí ani detaily.`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "drawing_prompts_schema",
        schema: {
          type: "object",
          properties,   // <- your schema definition object
          required: themes, // <- array of required themes
          additionalProperties: false,
        },
      },
    },
    temperature: 0.6,
  }),
});

    const result = await response.json();
    if (!response.ok) {
  throw new Error(`OpenAI error: ${result?.error?.message ?? JSON.stringify(result)}`);
}
    console.log(result);

    // Call the mutation directly by its local name
   // Extract the content (handles common response shapes)
const choice = result.choices?.[0];
const content = choice?.message?.content ?? choice?.text ?? null;
if (!content) throw new Error("No content returned from OpenAI");

// Parse if it's a JSON string, or accept it as an object
let resultObj: Record<string, string[]>;
if (typeof content === "string") {
  try {
    resultObj = JSON.parse(content) as Record<string, string[]>;
  } catch (e) {
    throw new Error("Failed to parse AI response JSON: " + String(e));
  }
} else {
  throw new Error("Unexpected content type from OpenAI");
}
for (const [theme, prompts] of Object.entries(resultObj)) {
  if (!Array.isArray(prompts)) continue;
  for (const p of prompts) {
    if (typeof p !== "string") continue;
    await ctx.runMutation(api.savePrompts.savePrompts, {
      game_id,
      theme,
      prompt: p,
      type: "simple",
    });
  }
}

    return "saved";
  },
});


export const generateDrawingPrompts_activity = action({
    args: {game_id: v.id("game"), themes: v.array(v.object({
      themeName: v.string(),
      description: v.string(),
    })) },
    handler: async (ctx, args) => {
      
    //const client = new OpenAI();
    
    const { game_id, themes } = args;

    const themeNames = themes.map(t => t.themeName);


    // Build JSON schema for structured output
const properties: Record<string, any> = {};
for (const { themeName, description } of themes) {
  properties[themeName] = {
    type: "array",
    description: `10 návrhů pro kreslení pro téma "${themeName}". Instrukce: ${description}`,
    items: { type: "string" },
    minItems: 10,
    maxItems: 10,
  };
}

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-4.1-nano-2025-04-14",
    messages: [
      {
        role: "system",
        content: "Jsi asistent, který vytváří návrhy na kreslení pro společenskou hru Pictionary v češtině.",
      },
      {
        role: "user",
        content: `Vytvoř návrhy pro kreslení, které pak bude vybraný hráč kreslit a ostatní hádat. Jeden návrh pro kreslení sestává z činitele děje a činnosti, kterou ten předmět dělá. Buď originální, ale činnosti které předmět vykonává musí být reálné, aby šly nakreslit. Ŕiď se předanými instrukcemi pro každé téma. Vymysli zábavné kombinace. Nepopisuj prostředí ani detaily předmětu.`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "drawing_prompts_schema",
        schema: {
          type: "object",
          properties,   // <- your schema definition object
          required: themeNames, // <- array of required themes
          additionalProperties: false,
        },
      },
    },
    temperature: 0.6,
  }),
});

    const result = await response.json();
    if (!response.ok) {
  throw new Error(`OpenAI error: ${result?.error?.message ?? JSON.stringify(result)}`);
}
    console.log(result);

    // Call the mutation directly by its local name
   // Extract the content (handles common response shapes)
const choice = result.choices?.[0];
const content = choice?.message?.content ?? choice?.text ?? null;
if (!content) throw new Error("No content returned from OpenAI");

// Parse if it's a JSON string, or accept it as an object
let resultObj: Record<string, string[]>;
if (typeof content === "string") {
  try {
    resultObj = JSON.parse(content) as Record<string, string[]>;
  } catch (e) {
    throw new Error("Failed to parse AI response JSON: " + String(e));
  }
} else {
  throw new Error("Unexpected content type from OpenAI");
}
for (const [theme, prompts] of Object.entries(resultObj)) {
  if (!Array.isArray(prompts)) continue;
  for (const p of prompts) {
    if (typeof p !== "string") continue;
    await ctx.runMutation(api.savePrompts.savePrompts, {
      game_id,
      theme,
      prompt: p,
      type: "party",
    });
  }
}

    return "saved";
  },
});