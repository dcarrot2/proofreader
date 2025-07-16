"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@radix-ui/react-label";
import { useActionState } from "react";
import { postForm } from "../server/actions";

export default function TextArea() {
  const [state, action, pending] = useActionState(postForm, null);

  console.log({ state, pending });

  return (
    <form action={action}>
      
      <div className="flex flex-col gap-4 items-center mb-6">
        <textarea
          name="text"
          placeholder="Enter the piece of text to edit"
          className="border border-gray-300 rounded-md p-2 w-3/5 h-[350px]"
        />
      </div>
      <div className="flex items-center justify-center gap-4 mb-6">
        <Checkbox id="grammar" name="grammar" defaultChecked value="grammar" disabled={pending} />
        <Label htmlFor="grammar">Grammar</Label>
        <Checkbox
          id="formatting"
          name="formatting"
          defaultChecked
          value="formatting"
          disabled={pending}
        />
        <Label htmlFor="formatting">Formatting</Label>
        <Checkbox
          id="punctuation"
          name="punctuation"
          defaultChecked
          value="punctuation"
          disabled={pending}
        />
        <Label htmlFor="punctuation">Punctuation</Label>
        <Checkbox
          id="spelling"
          name="spelling"
          defaultChecked
          value="spelling"
          disabled={pending}
        />
        <Label htmlFor="spelling">Spelling</Label>
        <Checkbox
          id="conciseness"
          name="conciseness"
          defaultChecked
          value="conciseness"
          disabled={pending}
        />
        <Label htmlFor="conciseness">Conciseness</Label>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button disabled={pending} type="submit">
          {pending ? "Processing..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
