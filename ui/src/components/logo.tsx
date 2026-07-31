export function Logo() {
  return (
    <div className="flex flex-wrap items-start">
      <div className="flex items-center gap-1">
        <img src="/Fluoce-Agent.svg" alt="agents-fluoce" className="h-8 w-8" />
        <h1 className="text-primary text-2xl font-semibold tracking-tighter">
          Agent
        </h1>
      </div>
      <span className="text-muted-foreground mx-3.5 flex items-center gap-0.5 text-xs font-semibold">
        by
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[--form] hover:underline"
          href="https://fluoce.com"
        >
          Fluoce
        </a>
      </span>
    </div>
  );
}
