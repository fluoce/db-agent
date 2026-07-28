import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";
import { mermaid } from "@streamdown/mermaid";
import { math } from "@streamdown/math";
import { cjk } from "@streamdown/cjk";

export default function App() {
  const markdown = `
# Hello World
Here's some code:
\`\`\`typescript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`
And a diagram:
\`\`\`mermaid
graph LR
    A[Start] --> B[End]
\`\`\`
And some math: $$E = mc^2$$
  `;
  return (
    <Streamdown
      plugins={{
        code: code,
        mermaid: mermaid,
        math: math,
        cjk: cjk,
      }}
    >
      {markdown}
    </Streamdown>
  );
}
