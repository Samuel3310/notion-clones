"use client";
import React from "react";
import * as Y from "yjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Markdown from "react-markdown";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { BotIcon, LanguagesIcon } from "lucide-react";

type Language =
  | "English"
  | "French"
  | "Spanish"
  | "German"
  | "Chinese"
  | "Arabic"
  | "Hindi"
  | "Portuguese"
  | "Russian"
  | "Japanese";

const languages: Language[] = [
  "English",
  "French",
  "Spanish",
  "German",
  "Chinese",
  "Arabic",
  "Hindi",
  "Portuguese",
  "Russian",
  "Japanese",
];

// Map user-friendly language names to language codes
const languageCodeMap: Record<Language, string> = {
  English: "en",
  French: "fr",
  Spanish: "es",
  German: "de",
  Chinese: "zh",
  Arabic: "ar",
  Hindi: "hi",
  Portuguese: "pt",
  Russian: "ru",
  Japanese: "ja",
};

const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
  const [language, setLanguage] = useState<Language>();
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();
      const targetLang = language ? languageCodeMap[language] : undefined;

      if (!targetLang) {
        toast.error("Please select a valid language.");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ documentData, targetLang }),
        }
      );

      if (res.ok) {
        const { translated_text } = await res.json();
        const id = toast.success("Translated Summary Successfully");
        setSummary(translated_text);
      } else {
        toast.error("Translation failed");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <LanguagesIcon /> Translate
        </DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate the Document</DialogTitle>
          <DialogDescription>
            Select a Language and AI will translate a summary of the document in
            the selected Language
          </DialogDescription>

          <hr className="mt-5" />
          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>

        {summary && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-bold">
                GPT {isPending ? " is thinking..." : " Says"}
              </p>
            </div>
            <div>
              {isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}
            </div>
          </div>
        )}

        <form className=" flex gap-2" onSubmit={handleAskQuestion}>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value as Language)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem value={language} key={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" disabled={isPending} variant="default">
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TranslateDocument;
