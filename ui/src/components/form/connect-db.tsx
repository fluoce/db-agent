import type { ReactNode } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { BadgeCheck, CheckCheck, Unplug } from "lucide-react";
import { useDBConnectionSave, useDBConnectionTest } from "@/hook/use-db";
import { Alert, AlertDescription } from "../ui/alert";
import { Spinner } from "../ui/spinner";
import { Checkbox } from "../ui/checkbox";

type DbConnectFormValues = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
};

export function ConnectDB({ children }: { children: ReactNode }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    getValues,
    control,
  } = useForm<DbConnectFormValues>({
    defaultValues: {
      ssl: false,
    },
  });

  const [open, setOpen] = useState(false);

  const {
    mutateAsync: testAsync,
    isPending: testPending,
    data,
    isError: testHaveError,
    error: testError,
    reset: testReset,
  } = useDBConnectionTest();
  const {
    mutateAsync: saveAsync,
    isPending: savePending,
    isError: saveHaveError,
    error: saveError,
    reset: saveReset,
  } = useDBConnectionSave();

  const onSubmit = async (formData: DbConnectFormValues) => {
    testReset();
    await saveAsync({ ...formData, type: "POSTGRES" as const });
    setOpen(false);
  };

  const handleTest = async () => {
    saveReset();
    const values = getValues();
    const requiredFields: Array<keyof DbConnectFormValues> = [
      "host",
      "port",
      "user",
      "password",
      "database",
    ];
    let hasError = false;
    requiredFields.forEach((field) => {
      if (
        values[field] === undefined ||
        values[field] === null ||
        (typeof values[field] === "string" && values[field].trim() === "") ||
        (typeof values[field] === "number" && isNaN(Number(values[field])))
      ) {
        setError(field, {
          type: "manual",
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
        });
        hasError = true;
      }
    });
    if (hasError) {
      return;
    }
    await testAsync({ ...values, type: "POSTGRES" });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        reset();
        testReset();
        saveReset();
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to Postgresql Database</DialogTitle>
          <DialogDescription>
            Fill in your database connection details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="host">Host</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="your.db-host.domain.com"
                    id="host"
                    type="text"
                    {...register("host", { required: "Host is required" })}
                    className="input"
                  />
                </FieldContent>
                <FieldError>{errors.host?.message}</FieldError>
              </Field>
            </FieldGroup>
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel htmlFor="port">Port</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="5432"
                    id="port"
                    type="number"
                    {...register("port", {
                      required: "Port is required",
                      valueAsNumber: true,
                    })}
                    className="input"
                  />
                </FieldContent>
                <FieldError>{errors.port?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="database">Database</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="database name"
                    id="database"
                    type="text"
                    {...register("database", {
                      required: "Database is required",
                    })}
                    className="input"
                  />
                </FieldContent>
                <FieldError>{errors.database?.message}</FieldError>
              </Field>
            </FieldGroup>
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel htmlFor="user">User</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="database user name"
                    id="user"
                    type="text"
                    {...register("user", { required: "User is required" })}
                    className="input"
                  />
                </FieldContent>
                <FieldError>{errors.user?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="database password"
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="input"
                  />
                </FieldContent>
                <FieldError>{errors.password?.message}</FieldError>
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field className="flex items-center justify-between">
                <FieldLabel htmlFor="ssl" className="mb-0">
                  SSL
                </FieldLabel>
                <div className="flex items-center gap-2">
                  <Controller
                    name="ssl"
                    control={control}
                    render={({ field: { value, onChange, ...field } }) => (
                      <Checkbox
                        id="ssl"
                        checked={!!value}
                        onCheckedChange={onChange}
                        className="cursor-pointer p-2"
                        {...field}
                      />
                    )}
                  />
                  <span>
                    Enable SSL{" "}
                    <span className="text-muted-foreground">
                      ( if supported )
                    </span>
                  </span>
                </div>
                <FieldError className="w-full">
                  {errors.ssl?.message}
                </FieldError>
              </Field>
            </FieldGroup>

            {data?.data?.success ? (
              <Alert className="text-primary">
                <BadgeCheck />
                <AlertDescription>{data?.data?.message}</AlertDescription>
              </Alert>
            ) : data?.data ? (
              <Alert variant="destructive">
                <BadgeCheck />
                <AlertDescription>{data?.data?.message}</AlertDescription>
              </Alert>
            ) : null}
            {testHaveError ? (
              <Alert variant="destructive" className="text-destructive">
                <BadgeCheck />
                <AlertDescription>
                  {testError?.message ?? "Error while testing connection"}
                </AlertDescription>
              </Alert>
            ) : null}
            {saveHaveError ? (
              <Alert variant="destructive" className="text-destructive">
                <BadgeCheck />
                <AlertDescription>
                  {saveError?.message ?? "Error while saving connection"}
                </AlertDescription>
              </Alert>
            ) : null}
          </FieldSet>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={handleTest}
              disabled={testPending || savePending}
            >
              {testPending ? <Spinner /> : <CheckCheck />} Test
            </Button>
            <Button type="submit" disabled={savePending || testPending}>
              {savePending ? <Spinner /> : <Unplug />} Connect
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
