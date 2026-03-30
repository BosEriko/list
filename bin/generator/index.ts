#!/usr/bin/env ts-node

const [, , command, resourceName] = process.argv;

if (!command || !resourceName) {
  console.error("Usage: yarn generate <command> <name>");
  process.exit(1);
}

const availableCommands = `Available commands:
  model <name>
  scaffold <name>
`;

const run = async () => {
  switch (command) {
    case "model": {
      const { generateModel } = await import("./model.ts");
      await generateModel(resourceName);
      break;
    }

    case "scaffold": {
      const { generateScaffold } = await import("./scaffold.ts");
      await generateScaffold(resourceName);
      break;
    }

    default: {
      console.error(`Unknown command: ${command}`);
      console.log(availableCommands);
      process.exit(1);
    }
  }
};

run();
