#!/usr/bin/env ts-node

const [, , command, name] = process.argv;

if (!command || !name) {
  console.error("Usage: yarn generate <command> <name>");
  process.exit(1);
}

const run = async () => {
  switch (command) {
    case "model": {
      const module = await import("./model");
      await module.default(name);
      break;
    }

    case "scaffold": {
      const module = await import("./scaffold");
      await module.default(name);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
};

run();
