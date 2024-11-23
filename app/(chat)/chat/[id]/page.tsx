import { CoreMessage } from "ai";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { DEFAULT_MODEL_NAME, models } from "@/ai/models";
import { auth } from "@/app/(auth)/auth";
import { Chat as PreviewChat } from "@/components/custom/chat";
import { getChatById, getMessagesByChatId } from "@/db/queries";
import { convertToUIMessages } from "@/lib/utils";

/**
 * Asynchronous function component that renders a chat page based on the provided chat ID.
 *
 * @param props - The properties object containing a promise that resolves to the parameters.
 * @returns A JSX element representing the chat page or triggers a not found response.
 *
 * The function performs the following steps:
 * 1. Awaits the resolution of the `params` promise to extract the chat ID.
 * 2. Fetches the chat data using the extracted ID.
 * 3. If the chat does not exist, triggers a not found response.
 * 4. Authenticates the current session.
 * 5. If the session is invalid or the user is not authenticated, triggers a not found response.
 * 6. If the authenticated user is not the owner of the chat, triggers a not found response.
 * 7. Fetches the messages associated with the chat ID.
 * 8. Retrieves the model ID from cookies and determines the selected model ID.
 * 9. Returns a `PreviewChat` component with the chat ID, initial messages, and selected model ID.
 */
export default async function Page(props: { params: Promise<any> }) {
  const params = await props.params;
  const { id } = params;
  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const session = await auth();

  if (!session || !session.user) {
    return notFound();
  }

  if (session.user.id !== chat.userId) {
    return notFound();
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;
  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  return (
    <PreviewChat
      id={chat.id}
      initialMessages={convertToUIMessages(messagesFromDb)}
      selectedModelId={selectedModelId}
    />
  );
}
