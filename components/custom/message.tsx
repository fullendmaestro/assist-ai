"use client";

import { Message as Messagetype } from "ai";
import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import cx from "classnames";

import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";
import { Weather } from "./weather";
import { MessageActions } from "./message-actions";

export const Message = ({
  chatId,
  message,
  role,
  content,
  toolInvocations,
  attachments,
  isLoading,
  togglePanel,
}: {
  chatId: string;
  message: Messagetype;
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
  isLoading: boolean;
  togglePanel: (attachments: Attachment[]) => void;
}) => {
  const handletogglePanel = () => {
    togglePanel(attachments || []);
  };

  return (
    <motion.div
      className="w-full px-4 group/message md:w-[500px] md:px-0"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={role}
    >
      <div
        className={cx(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-primary group-data-[role=user]/message:text-primary-foreground":
              role === "user",
          }
        )}
      >
        {role === "assistant" ? (
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
            <BotIcon />
          </div>
        ) : null}
        <div className="flex flex-col gap-2 w-full">
          {content && typeof content === "string" && (
            <div className="flex flex-col gap-4 text-zinc-800 dark:text-zinc-300">
              <Markdown>{content}</Markdown>
            </div>
          )}

          {toolInvocations && (
            <div className="flex flex-col gap-4">
              {toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === "result") {
                  const { result } = toolInvocation;

                  return (
                    <div key={toolCallId}>
                      {toolName === "getWeather" ? (
                        <Weather weatherAtLocation={result} />
                      ) : (
                        <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                          {JSON.stringify(result, null, 2)}
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div key={toolCallId} className="skeleton">
                      {toolName === "getWeather" ? <Weather /> : null}
                    </div>
                  );
                }
              })}
            </div>
          )}

          {attachments && (
            <div className="flex flex-row gap-2" onClick={handletogglePanel}>
              {attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                />
              ))}
            </div>
          )}
          <MessageActions
            key={`action-${message.id}`}
            chatId={chatId}
            message={message}
            isLoading={isLoading}
          />
        </div>
      </div>
    </motion.div>
  );
};
