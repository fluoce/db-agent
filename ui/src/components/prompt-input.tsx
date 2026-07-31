import { useDBs } from "@/hook/use-db";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowUp, ChevronDown, DatabaseZap } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

import { SelectDatabase } from "./select-database";
import { route } from "@/const/route";
import { useState } from "react";

export function PromptInput({
  onSubmit,
  disabled,
}: {
  disabled: boolean;
  onSubmit: (message: string) => void;
}) {
  const [message, setMessage] = useState("");

  const { databaseId } = useParams<{ databaseId: string }>();

  const navigate = useNavigate();

  const { data } = useDBs();

  const db = data?.data?.database?.find((db) => db.id == databaseId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return; // Prevent submission if disabled
    if (message.trim() !== "") {
      onSubmit(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (disabled) return; // Prevent submission if disabled
      if (message.trim() !== "") {
        onSubmit(message);
        setMessage("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex w-full justify-center">
        <InputGroup className="bg-muted shadow-primary/20 w-full max-w-180 rounded-xl p-2 ring-0!">
          <InputGroupTextarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about your database . . . ."
            className="max-h-24 scrollbar-none overflow-auto"
            onKeyDown={handleKeyDown}
          />
          <InputGroupAddon align="block-end" className="p-0 pt-2">
            <SelectDatabase
              onDatabaseChange={(databaseId) => {
                navigate(route.agent.chat.db(databaseId));
              }}
              children={
                <InputGroupText className="bg-background cursor-pointer rounded-lg border p-1.5 text-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted flex items-center justify-center rounded-md p-1.5">
                      <DatabaseZap size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="line-clamp-1 truncate text-xs font-medium">
                        {db?.database!}
                      </span>
                      <span className="text-muted-foreground text-[10px] font-medium">
                        {db?.host!}
                      </span>
                    </div>
                  </div>
                  <ChevronDown />
                </InputGroupText>
              }
              skeleton={
                <InputGroupText className="bg-background rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-7 rounded-md" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-3.5 w-25" />
                      <Skeleton className="h-3.5 w-60" />
                    </div>
                  </div>
                </InputGroupText>
              }
            />
            <InputGroupButton
              variant="default"
              size="icon-sm"
              className="mt-auto ml-auto rounded-lg"
              type="submit"
              disabled={disabled}
            >
              <ArrowUp />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </form>
  );
}
