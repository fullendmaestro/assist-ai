import { cookies } from "next/headers";

import { DEFAULT_MODEL_NAME, models } from "@/ai/models";
import { Chat } from "@/components/custom/chat";
import { generateUUID } from "@/lib/utils";

export default async function Page() {
  // Generate a unique identifier for the chat session
  const id = generateUUID();

  // Retrieve cookies from the request headers
  const cookieStore = await cookies();
  // Get the model ID from the cookies, if it exists
  const modelIdFromCookie = cookieStore.get("model-id")?.value;

  // Determine the selected model ID, defaulting to the default model name if not found
  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      selectedModelId={selectedModelId}
    />
  );
}
