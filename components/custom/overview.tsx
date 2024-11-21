import { Bot, MessageSquare } from "lucide-react";

import Link from "next/link";

import { motion } from "framer-motion";

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
            This project is designed to assist users with AI-driven prompts. It
            leverages the power of modern AI technologies to provide insightful
            and helpful responses to user queries.
          </p>
          <p className="text-lg">
            By integrating with various APIs and utilizing advanced machine
            learning models, this project aims to deliver accurate and
            contextually relevant information in a user-friendly manner.
          </p>
          <Link href="/learn-more">Learn more</Link>
        </p>
      </div>
    </motion.div>
  );
};
