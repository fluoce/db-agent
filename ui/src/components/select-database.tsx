import { useDBs } from "@/hook/use-db";
import type { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useParams } from "react-router-dom";

export function SelectDatabase({
  children,
  skeleton,
  onDatabaseChange,
}: {
  children: ReactNode;
  skeleton: ReactNode;
  onDatabaseChange?: (databaseId: string) => void;
}) {
  const { databaseId } = useParams<{ databaseId: string }>();

  const { data, isPending } = useDBs();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {isPending ? skeleton : children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full max-w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>All Database</DropdownMenuLabel>
          {data?.data?.database?.map((db) => (
            <DropdownMenuItem
              onClick={() => {
                if (db?.id != databaseId) {
                  onDatabaseChange?.(db?.id);
                }
              }}
              className="line-clamp-1 truncate"
              key={db?.id}
            >
              <div className="flex flex-col">
                <span className="line-clamp-1 truncate">{db?.database}</span>
                <span className="text-muted-foreground line-clamp-1 truncate text-sm">
                  {db?.host}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
