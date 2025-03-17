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
import { Input } from "@/components/ui/input";

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
import { BotIcon, DockIcon } from "lucide-react";



const ChatDocument = ({ doc }: { doc: Y.Doc }) => {

  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();
      console.log(question);
      if (!question) {
        toast.error("Please enter something");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chatDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ documentData, question }),
        }
      );

      if (res.ok) {
        const { message } = await res.json();
        const id = toast.success("Translated Summary Successfully");
        setAnswer(message);
      } else {
        toast.error("Sorry, could not ask the question this time around");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <DockIcon /> Chat Document
        </DialogTrigger>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ask about your document</DialogTitle>
          <DialogDescription>
            You can ask the chatbot about your document
          </DialogDescription>

          <hr className="mt-5" />
          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>

        {answer && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-bold">
                GPT {isPending ? " is thinking..." : " Says"}
              </p>
            </div>
            <div>
              {isPending ? "Thinking..." : <Markdown>{answer}</Markdown>}
            </div>
          </div>
        )}

        <form className=" flex gap-2" onSubmit={handleAskQuestion}>
          <Input
            type="text"
            placeholder="Ask Your question"
            onChange={(e) => setQuestion(e.target.value)}
          />

          <Button type="submit" disabled={isPending} variant="default">
            {isPending ? "Asking..." : "Ask"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDocument;
