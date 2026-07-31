const agentBase = "/agent";
const chatBase = "/chat";

export const route = {
  base: "/",
  authCallback: "/auth",
  agent: {
    base: agentBase,
    chat: {
      db: (databaseId: string) => `${agentBase}${chatBase}/db/${databaseId}`,
    },
  },
};

export const childRoute = {
  chat: {
    db: `${agentBase}${chatBase}/db/:databaseId`,
  },
};
