"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useWindowSize } from "usehooks-ts";

import { ChatHeader } from "@/components/custom/chat-header";
import { PreviewMessage, ThinkingMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Vote } from "@/db/schema";
import { fetcher } from "@/lib/utils";

import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";
import { PannelAttachment } from "./panel-attachment-preview";

export function Chat({
  id,
  initialMessages,
  selectedModelId,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
}) {
  // SWR configuration for data mutation
  const { mutate } = useSWRConfig();

  // Chat hook to manage chat state and actions
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    data: streamingData,
  } = useChat({
    body: { id, modelId: selectedModelId },
    initialMessages,
    onFinish: () => {
      mutate("/api/history");
    },
  });

  // Hook to get window size
  const { width: windowWidth = 1920, height: windowHeight = 1080 } =
    useWindowSize();

  // Fetch votes data using SWR
  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher
  );

  // Hooks to manage scrolling to bottom of the chat
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  // State hook to manage attachments
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  // State hook to manage the list of attachments in the chat panel
  const [panelAttachments, setPanelAttachments] = useState<Array<Attachment>>(
    []
  );

  // State hook to manage the visibility of the panel
  const [panelOpen, setPanelOpen] = useState(false);

  // Function to toggle the visibility of the panel and set the attachments to display
  const togglePanel = (attachments: Attachment[]) => {
    setPanelOpen((prevState) => !prevState);
    setPanelAttachments(attachments);
  };

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="w-screen h-screen">
        <ResizablePanel minSize={20}>
          <div className="flex flex-col min-w-0 h-dvh bg-background">
            <ChatHeader selectedModelId={selectedModelId} />
            <div
              ref={messagesContainerRef}
              className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
            >
              {messages.length === 0 && <Overview />}

              {messages.map((message, index) => (
                <PreviewMessage
                  key={message.id}
                  chatId={id}
                  message={message}
                  isLoading={isLoading && messages.length - 1 === index}
                  vote={
                    votes
                      ? votes.find((vote) => vote.messageId === message.id)
                      : undefined
                  }
                  togglePanel={togglePanel}
                />
              ))}

              {isLoading &&
                messages.length > 0 &&
                messages[messages.length - 1].role === "user" && (
                  <ThinkingMessage />
                )}

              <div
                ref={messagesEndRef}
                className="shrink-0 min-w-[24px] min-h-[24px]"
              />
            </div>
            <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
              <MultimodalInput
                chatId={id}
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                stop={stop}
                attachments={attachments}
                setAttachments={setAttachments}
                messages={messages}
                setMessages={setMessages}
                append={append}
                togglePanel={togglePanel}
              />
            </form>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        {panelOpen && (
          <ResizablePanel minSize={20} className="hidden md:block p-5">
            <PannelAttachment
              panelattachments={panelAttachments}
              togglePanel={togglePanel}
            />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </>
  );
}
