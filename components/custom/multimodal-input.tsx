"use client";

import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import cx from "classnames";
import { motion } from "framer-motion";
import { ImageIcon, MicIcon } from "lucide-react";
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";

import { sanitizeUIMessages } from "@/lib/utils";
import SpeechRecognition, {
  useSpeechRecognition,
} from "@/node_lib_local/react-speech-recognition";

import { ArrowUpIcon, PaperclipIcon, StopIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const suggestedActions = [
  {
    title: "What is the weather",
    label: "in San Francisco?",
    action: "What is the weather in San Francisco?",
  },
  {
    title: "Help me draft an essay",
    label: "about Silicon Valley",
    action: "Help me draft a short essay about Silicon Valley",
  },
];

export function MultimodalInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
  togglePanel,
}: {
  chatId: string;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  className?: string;
  togglePanel: (attachments: Attachment[]) => any;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Reference to the textarea element
  const { width } = useWindowSize(); // Get the window size

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight(); // Adjust the height of the textarea on mount
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`; // Adjust the height based on scroll height
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    ""
  ); // Local storage for input

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      const finalValue = domValue || localStorageInput || ""; // Prefer DOM value over localStorage to handle hydration
      setInput(finalValue);
      adjustHeight(); // Adjust the height after setting input
    }
  }, []); // Only run once after hydration

  useEffect(() => {
    setLocalStorageInput(input); // Update local storage when input changes
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value); // Update input state
    adjustHeight(); // Adjust the height of the textarea
  };

  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to the file input element
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]); // State for upload queue

  const submitForm = useCallback(() => {
    window.history.replaceState({}, "", `/chat/${chatId}`); // Update URL without reloading

    handleSubmit(undefined, {
      experimental_attachments: attachments, // Submit form with attachments
    });

    setAttachments([]); // Clear attachments
    setLocalStorageInput(""); // Clear local storage input

    if (width && width > 768) {
      textareaRef.current?.focus(); // Focus on textarea if width is greater than 768px
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    width,
    chatId,
  ]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file); // Append file to form data

    try {
      const response = await fetch(`/api/files/upload`, {
        method: "POST",
        body: formData, // Upload file
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType, // Return file details
        };
      } else {
        const { error } = await response.json();
        toast.error(error); // Show error toast
      }
    } catch (error) {
      toast.error("Failed to upload file, please try again!"); // Show error toast
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []); // Get selected files

      setUploadQueue(files.map((file) => file.name)); // Update upload queue

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments, // Update attachments with successfully uploaded files
        ]);
      } catch (error) {
        console.error("Error uploading files!", error); // Log error
      } finally {
        setUploadQueue([]); // Clear upload queue
      }
    },
    [setAttachments]
  );

  const [isRecording, setIsRecording] = useState(false); // State for recording
  const { transcript, resetTranscript, listening } = useSpeechRecognition(); // Speech recognition hooks
  const [prevInput, setPrevInput] = useState(""); // State for previous input

  useEffect(() => {
    let newInput = `${prevInput + transcript}`;

    if (transcript) {
      setInput(newInput); // Update input with transcript
    }
  }, [transcript]);

  const startRecording = () => {
    setPrevInput(input); // Save current input
    setIsRecording(true); // Set recording state
    SpeechRecognition.startListening({ continuous: true, language: "en-US" }); // Start listening
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening(); // Stop listening
    setInput(`${prevInput + transcript}`); // Update input with transcript
    resetTranscript(); // Reset transcript
    setIsRecording(false); // Set recording state
  };

  const handletogglePanel = () => {
    togglePanel(attachments); // Toggle panel with attachments
  };

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <div className="grid sm:grid-cols-2 gap-2 w-full">
            {suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <Button
                  variant="ghost"
                  onClick={async () => {
                    window.history.replaceState({}, "", `/chat/${chatId}`);

                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
                >
                  <span className="font-medium">{suggestedAction.title}</span>
                  <span className="text-muted-foreground">
                    {suggestedAction.label}
                  </span>
                </Button>
              </motion.div>
            ))}
          </div>
        )}

      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div
          className="flex flex-row gap-2 overflow-x-scroll items-end"
          onClick={handletogglePanel}
        >
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}

          {uploadQueue.map((filename) => (
            <PreviewAttachment
              key={filename}
              attachment={{
                url: "",
                name: filename,
                contentType: "",
              }}
              isUploading={true}
            />
          ))}
        </div>
      )}

      <Textarea
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className={cx(
          "min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-xl text-base bg-muted",
          className
        )}
        rows={3}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            if (isLoading) {
              toast.error("Please wait for the model to finish its response!");
            } else {
              submitForm();
            }
          }
        }}
      />

      {isLoading ? (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
          onClick={(event) => {
            event.preventDefault();
            stop();
            setMessages((messages) => sanitizeUIMessages(messages));
          }}
        >
          <StopIcon size={14} />
        </Button>
      ) : (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5 border dark:border-zinc-600"
          onClick={(event) => {
            event.preventDefault();
            submitForm();
          }}
          disabled={input.length === 0 || uploadQueue.length > 0}
        >
          <ArrowUpIcon size={14} />
        </Button>
      )}

      <Button
        className="rounded-full p-1.5 h-fit absolute bottom-2 right-11 m-0.5 dark:border-zinc-700"
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current?.click();
        }}
        variant="outline"
        disabled={isLoading}
      >
        <ImageIcon size={14} />
      </Button>
      <Button
        className="rounded-full p-1.5 h-fit absolute bottom-2 right-18 m-0.5 dark:border-zinc-700"
        onClick={(event) => {
          event.preventDefault();
          if (isRecording) {
            stopRecording();
          } else {
            startRecording();
          }
        }}
        variant={isRecording ? "destructive" : "outline"}
        disabled={isLoading}
      >
        <MicIcon size={14} />
      </Button>
    </div>
  );
}
