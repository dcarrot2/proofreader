"use server";

import { GeminiProvider } from "../llm_provider";
import { createClient, TABLES } from "../utils";


const promptFactory = (ruleset: string[], text: string) => {
  return `
    You are a helpful assistant tasked with editing and proofreading a piece of text.
    You MUST adhere to the following rules and never deviate from them to successfully complete the task.
    
    Rules to follow:
    ${ruleset.map((rule) => `- ${rule}`).join("\n")}

    Text to edit:
    ${text}
  `;
};

const mapOptionsToRuleset = (options: string[]) => {
  const map = {
    conciseness:
      "Be concise and to the point. Remove any unnecessary words or phrases but do not remove any information necessary to communicate the full intent of the text.",
    grammar:
      "Ensure the text is grammatically correct and follows the rules of the English language.",
    style:
      "Ensure the text is written in a style that is consistent with the intended audience.",
    formatting:
      "Ensure the text is formatted correctly and follows the rules of the English language.",
    punctuation:
      "Ensure the text is punctuated correctly and follows the rules of the English language.",
    spelling:
      "Ensure the text is spelled correctly and follows the rules of the English language.",
  };

  return options
    .map((option) => map[option as keyof typeof map])
    .filter(Boolean);
};

export async function submitText(prevState: unknown, formData: FormData) {
  const db = await createClient();

  const text = formData.get("text") as string;
  const rawOptions = (formData.get("options") as string).split(",");
  const options = rawOptions.map((option) => option.trim());

  // TODO: Validate the text and options

  const ruleset = mapOptionsToRuleset(options);
  const prompt = promptFactory(ruleset, text);

  const provider = new GeminiProvider();
  const response = await provider.generateText(prompt, "gemini-2.5-flash");

  const { error } = await db.from(TABLES.SUBMISSIONS).insert({
    original_text: text,
    selected_options: options,
    prompt,
    proofread_text: response,
  });

  if (error) {
    console.error(error);
    return { message: `Unable to save submission` };
  }


  // TODO: Revalidate cache.
  // Redirect to the submission page.
  return { message: 'Submission saved' }
}

export async function postForm(prevState: unknown, formData: FormData) {
  const selectedOptions: string[] = [];
  const checkboxes = [
    "grammar",
    "formatting",
    "punctuation",
    "spelling",
    "conciseness",
  ];

  checkboxes.forEach((checkbox) => {
    const value = formData.get(checkbox) as string;
    if (value) {
      selectedOptions.push(value);
    }
  });

  const text = formData.get("text") as string;
  const options = selectedOptions.join(",");

  const revisedFormData = new FormData();
  revisedFormData.set("text", text);
  revisedFormData.set("options", options);

  return await submitText(null, revisedFormData);
}
