import { useDBConnectionDelete, useDBs } from "@/hook/use-db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Kbd } from "@/components/ui/kbd";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { BadgeInfo, DatabaseZap, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectDB } from "@/components/form/connect-db";
import { PageHeader } from "@/components/page-header";
import { Link } from "react-router-dom";
import { route } from "@/const/route";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function Agent() {
  const [open, setOpen] = useState(false);

  const { data, isPending } = useDBs();

  const {
    mutateAsync,
    isPending: deletePeding,
    isError,
    error,
  } = useDBConnectionDelete();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        icon={<DatabaseZap size={18} />}
        title="All Database"
        description="Start a chat by clicking on a database's name"
      />
      {isPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data && data?.data?.database.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {data?.data?.database?.map((db) => (
            <Card className="h-46" key={db?.id}>
              <Link
                to={route.agent.chat.db(db?.id)}
                className="group cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="group-hover:text-blue-500">
                    {db?.database} - <Kbd>{db?.type}</Kbd>
                  </CardTitle>
                </CardHeader>
              </Link>
              <CardContent className="text-muted-foreground">
                <div className="flex flex-col gap-2">
                  <div className="line-clamp-2">
                    <Kbd>Host</Kbd> {db?.host ?? "-"}
                  </div>
                  <span>
                    <Kbd>Port</Kbd> {db?.port ?? "-"}
                  </span>
                </div>
                <div className="flex w-full items-end justify-end">
                  <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger disabled={isPending}>
                      <Button size="icon-xs" variant="destructive">
                        <Trash2 />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete Database Connection
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this database
                          connection? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      {isError ? (
                        <Alert variant="destructive">
                          <BadgeInfo />
                          <AlertDescription>
                            {error?.message ||
                              "Something went wrong while deleting"}
                          </AlertDescription>
                        </Alert>
                      ) : null}
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={deletePeding}
                          variant="destructive"
                          onClick={() => {
                            mutateAsync(db?.id).then(() => setOpen(false));
                          }}
                        >
                          {deletePeding && <Spinner />} Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BadgeInfo />
            </EmptyMedia>
            <EmptyTitle>Add Database Connection</EmptyTitle>
            <div>
              <EmptyDescription>
                You haven't connected any database yet.
              </EmptyDescription>
              <EmptyDescription>
                Get started by adding a database connection.
              </EmptyDescription>
            </div>
          </EmptyHeader>
          <EmptyContent>
            <ConnectDB>
              <Button>Connect</Button>
            </ConnectDB>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
