import { ChevronDown, LogOut } from "lucide-react";
import { ConnectDB } from "./form/connect-db";
import { Logo } from "./logo";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Spinner } from "./ui/spinner";
import { route } from "@/const/route";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFluoceAuth } from "@fluoce/auth-react";
import { SelectDatabase } from "./select-database";

export function ActionBar() {
  const { user, logout } = useFluoceAuth();

  const navigate = useNavigate();

  return (
    <div className="flex w-full items-center justify-between gap-4 py-2">
      <Link to={route.agent.base}>
        <Logo />
      </Link>
      <div className="flex items-center gap-2">
        <AnimatedThemeToggler />
        <ButtonGroup>
          <ConnectDB>
            <Button>Connect DB</Button>
          </ConnectDB>
          <SelectDatabase
            onDatabaseChange={(databaseId) => {
              navigate(route.agent.chat.db(databaseId));
            }}
            children={
              <Button>
                <ChevronDown />
              </Button>
            }
            skeleton={
              <Button variant="secondary">
                <Spinner />
              </Button>
            }
          />
        </ButtonGroup>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="size-8.25 cursor-pointer rounded-md">
              <AvatarImage className="rounded-md" src={user?.photo!} />
              <AvatarFallback className="rounded-md">
                {user?.name.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full max-w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-foreground line-clamp-1 truncate">
                    {user?.name}
                  </span>
                  <span className="text-muted-foreground line-clamp-1 truncate">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={logout}>
                <LogOut /> Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
