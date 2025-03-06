"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/actions/actions";
import { useEffect, useState } from "react";

const NewDocumentButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCreateDocument = () => {
    startTransition(async () => {
      const { docId } = await createNewDocument();
      router.push(`/doc/${docId}`);
    });
  };

  if (!isClient) {
    return null;
  }

  return (
    <Button onClick={handleCreateDocument} disabled={isPending}>
      {isPending ? "Creating Document" : "New Document"}
    </Button>
  );
};

export default NewDocumentButton;
