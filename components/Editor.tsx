"use client";

import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/core/style.css";
import "@blocknote/shadcn/style.css";

import stringToColor from "@/lib/stringToColor";
import TranslateDocument from "./TranslateDocument";
import ChatDocument from "./ChatDocument";

type EditorProps = {
  document: Y.Doc;
  provider: LiveblocksYjsProvider;
  darkMode: boolean;
};

function BlockNote({ document, provider, darkMode }: EditorProps) {
  const userInfo = useSelf((me) => me.info);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Initialize the editor
  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: document.getXmlFragment("document-store"),
      user: {
        name: userInfo?.info.name,
        color: stringToColor(userInfo?.info.email),
      },
    },
  });

  // Set editor ready state once it's initialized
  useEffect(() => {
    if (editor) {
      setIsEditorReady(true);
    }
  }, [editor]);

  // Show loading state if the editor isn't ready
  if (!isEditorReady) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView
        className="min-h-screen"
        editor={editor}
        theme={darkMode ? "dark" : "light"}
        editable={true}
      />
    </div>
  );
}

const Editor = () => {
  const room = useRoom();
  const [document, setDocument] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  // Initialize Y.Doc and LiveblocksYjsProvider
  useEffect(() => {
    if (!room) return;

    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);

    setDocument(yDoc);
    console.log(yDoc);
    setProvider(yProvider);

    // Cleanup on unmount
    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, [room]);

  // Show loading state if room, document, or provider isn't ready
  if (!room || !document || !provider) {
    return <div>Loading room...</div>;
  }

  const style = darkMode
    ? "text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-gray-100"
    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-700";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-end mb-10">
        <TranslateDocument doc={document} />
        <ChatDocument doc={document} />
        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      <BlockNote document={document} provider={provider} darkMode={darkMode} />
    </div>
  );
};

export default Editor;
