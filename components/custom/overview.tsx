import { motion } from "framer-motion";
import { Bot, MessageSquare } from "lucide-react";
import Link from "next/link";

import { Button } from "../ui/button";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <Bot size={32} />
          <span>+</span>
          <MessageSquare size={32} />
        </p>
        <p>
          <h2 className="text-2xl font-bold">Bot Overview</h2>
          <p className="text-lg">
            This is an AI Assinstant that transform text, speech, and visuals
            into immersive experiences. It is designed to assist users with
            AI-driven prompts. It leverages the power of Google&apos;s Gemini AI
            technologies to provide insightful and helpful responses to user
            queries.
          </p>
          <Button
            className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900"
            asChild
          >
            <Link href="https://github.com/fullendmaestro/assist-ai">
              Learn more
            </Link>
          </Button>
        </p>
      </div>
    </motion.div>
  );
};
