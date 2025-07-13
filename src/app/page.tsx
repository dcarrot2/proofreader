import { Button } from "@/components/ui/button";
import { GeminiProvider } from "./llm_provider";
import { createClient, TABLES } from "./utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export async function submitText(formData: FormData) {
  "use server";

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
    response,
  });

  if (error) {
    throw new Error(`Unable to save submission: ${error.message}`);
  }

  // TODO: Revalidate cache.
  // Redirect to the submission page.
}

export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px]  justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full">
        <Tabs
          defaultValue="form"
          className="w-full flex flex-col items-center gap-4"
        >
          <TabsList className="">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
          </TabsList>
          <TabsContent
            value="form"
            className="w-full flex flex-col items-center gap-4"
          >
            <div className="w-full">
              <TextArea />
            </div>
          </TabsContent>
          <TabsContent value="submissions">
            <Submissions />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function TextArea() {
  return (
    <form action={submitText}>
      <div className="flex flex-col gap-4 items-center">
        <textarea
          name="text"
          placeholder="Enter the piece of text to edit"
          className="border border-gray-300 rounded-md p-2 w-3/5 h-[350px]"
        />
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}

function Submissions() {
  return null;
}
