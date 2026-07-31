import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { PromptInput } from "@/components/prompt-input";
import { useFluoceAuth } from "@fluoce/auth-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function DBChat() {
  const { access_token } = useFluoceAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [disabled, setDisabled] = useState(false);
  const { databaseId } = useParams<{ databaseId: string }>();

  async function onSubmit(message: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };
    setMessages((prev) => [...prev, userMessage]);
    setDisabled(true);

    if (!databaseId || !access_token) {
      setDisabled(false);
      return;
    }

    const assistantMessageId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: "assistant", content: "" },
    ]);

    try {
      const endpoint = `http://localhost:8000/chat/db/${databaseId}?message=${encodeURIComponent(
        message,
      )}&access_token=${encodeURIComponent(access_token)}`;
      const eventSource = new EventSource(endpoint);

      let fullResponse = "";

      eventSource.onmessage = (event) => {
        fullResponse += event.data;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: fullResponse }
              : msg,
          ),
        );
      };

      eventSource.onerror = () => {
        eventSource.close();
        setDisabled(false);
      };

      eventSource.onopen = () => {};

      eventSource.addEventListener("done", () => {
        eventSource.close();
        setDisabled(false);
      });
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "Error connecting to server." }
            : msg,
        ),
      );
      setDisabled(false);
    }
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-8 overflow-y-auto p-6 pb-32">
        {messages.map((message) => (
          <Message key={message.id} from={message.role}>
            <MessageContent>
              {message.role === "assistant" ? (
                <MessageResponse>{message.content}</MessageResponse>
              ) : (
                message.content
              )}
            </MessageContent>
          </Message>
        ))}
        {disabled ? (
          <Marker>
            <MarkerIcon>
              <img src="/Fluoce-Agent.svg" />
            </MarkerIcon>
            <MarkerContent className="shimmer">Thinking . . . </MarkerContent>
          </Marker>
        ) : null}
      </div>
      <div className="bg-background sticky right-0 bottom-0 left-0 z-10 p-2">
        <PromptInput onSubmit={onSubmit} disabled={disabled} />
      </div>
    </div>
  );
}
