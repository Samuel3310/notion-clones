"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import { useOwner } from "@/lib/useOwner";

const Document = ({ id }: { id: string }) => {
  const [isUpdating, startTransition] = useTransition();
  const [input, setInput] = useState("");
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const isOwner = useOwner();
  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), { title: input });
      });
    }
  };
  return (
    <div className="flex-1 h-full bg-white p-5">
      {/* title field */}
      <div className="flex max-w-6xl pb-5 justify-between mx-auto ">
        <form
          className="flex space-x-2 items-center w-full"
          onSubmit={updateTitle}
        >
          <Input
            placeholder="Name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "update"}
          </Button>
          {isOwner && (
            <>
              <p>I own this</p>
            </>
          )}
        </form>
      </div>
      {/* avatar  */}
      {/* manage User*/}
      <hr className="pb-10" />
      {/* collaborative Editor  */}
      <Editor />
    </div>
  );
};

export default Document;
