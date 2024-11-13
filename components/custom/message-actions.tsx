import { Message } from "ai";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { useCopyToClipboard } from "usehooks-ts";

import { Vote } from "@/db/schema";
import { getMessageIdFromAnnotations } from "@/lib/utils";

import { CopyIcon, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

export function MessageActions({
  chatId,
  message,
  isLoading,
}: {
  chatId: string;
  message: Message;
  isLoading: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [_, copyToClipboard] = useCopyToClipboard();

  if (isLoading) return null;
  if (message.role === "user") return null;
  if (message.toolInvocations && message.toolInvocations.length > 0)
    return null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground"
              variant="outline"
              onClick={async () => {
                await copyToClipboard(message.content as string);
                toast.success("Copied to clipboard!");
              }}
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        {!isPlaying && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="py-1 px-2 h-fit text-muted-foreground"
                variant="outline"
                onClick={async () => {
                  speechSynthesis.cancel();
                  setIsPlaying(true);
                  toast.success("Message started playing!");
                  const utterance = new SpeechSynthesisUtterance(
                    message.content as string
                  );
                  utterance.onend = () => {
                    setIsPlaying(false);
                  };
                  speechSynthesis.speak(utterance);
                }}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Read</TooltipContent>
          </Tooltip>
        )}
        {isPlaying && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="py-1 px-2 h-fit text-muted-foreground"
                variant="outline"
                onClick={async () => {
                  speechSynthesis.cancel();
                  setIsPlaying(false);
                  await copyToClipboard(message.content as string);
                  toast.success("Message stoped playing!");
                }}
              >
                <VolumeX className="h-4 w-4 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Stop</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
