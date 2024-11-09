"use client";

import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";

import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";
import Image from "next/image";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      id,
      body: { id },
      initialMessages,
      maxSteps: 10,
      onFinish: () => {
        window.history.replaceState({}, "", `/chat/${id}`);
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  // State hook to manage the list of attachments in the chat panel
  const [panelAttachments, setPanelAttachments] = useState<Array<Attachment>>(
    []
  );

  // State hook to manage the visibility of the panel
  const [pannelOpen, setPannelOpen] = useState(false);

  // Function to toggle the visibility of the panel and set the attachments to display
  const togglePannel = (attachments: Attachment[]) => {
    setPannelOpen((prevState) => !prevState);
    setPanelAttachments(attachments);
  };

  useEffect(() => {
    console.log("Attachments changed:", attachments);
  }, [attachments]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
          <div className="flex flex-col justify-between items-center gap-4">
            <div
              ref={messagesContainerRef}
              className="flex flex-col gap-4 h-full w-dvw items-center overflow-y-scroll"
            >
              {messages.length === 0 && <Overview />}

              {messages.map((message) => (
                <PreviewMessage
                  key={message.id}
                  chatId={id}
                  role={message.role}
                  content={message.content}
                  attachments={message.experimental_attachments}
                  toolInvocations={message.toolInvocations}
                  togglePanel={togglePannel}
                />
              ))}

              <div
                ref={messagesEndRef}
                className="shrink-0 min-w-[24px] min-h-[24px]"
              />
            </div>

            <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0">
              <MultimodalInput
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                stop={stop}
                attachments={attachments}
                setAttachments={setAttachments}
                messages={messages}
                append={append}
                togglePanel={togglePannel}
              />
            </form>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />

      {pannelOpen && (
        <ResizablePanel>
          <div className="flex justify-center items-center h-full p-10">
            <Carousel className="w-full max-w-xs">
              <CarouselContent>
                {panelAttachments.map((attachment, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <Image
                            src={attachment.url}
                            alt={attachment.name || "Attachment"}
                            width={500}
                            height={500}
                            className="w-full h-auto"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  );
}
