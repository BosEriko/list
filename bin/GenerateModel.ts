#!/usr/bin/env node
import fs from "fs";
import path from "path";
import pluralize from "pluralize";

// Get model name from command line
const modelName = process.argv[2];

if (!modelName) {
  console.error("Usage: yarn generate:model <ModelName>");
  process.exit(1);
}

// Convert model name to match filename conventions
const dirName = path.join("app", "(model)", modelName);
const filePath = path.join(dirName, "index.ts");

// Pluralize collection name
const collectionName = pluralize(modelName.charAt(0).toLowerCase() + modelName.slice(1));

// Boilerplate content for model
const modelContent = `import CreateService from "../concerns/CreateService";
import { ${modelName}Schema } from "@schema";

const ${modelName} = CreateService({
  collection: "${collectionName}",
  schema: ${modelName}Schema,
});

export default ${modelName};
`;

// Create model directory and write index.ts
fs.mkdirSync(dirName, { recursive: true });
fs.writeFileSync(filePath, modelContent);

console.log(`create  ${path.relative(process.cwd(), filePath)}`);

// --- Append schema stub to db/schema.ts ---
const schemaFilePath = path.join("db", "schema.ts");

// Make sure db/schema.ts exists
const schemaContent = `
import { z } from "zod";

// Helper Functions
function firestoreTimestampToDate(val: unknown) {
  if (
    val &&
    typeof val === "object" &&
    "toDate" in val &&
    typeof (val as any).toDate === "function"
  ) {
    return (val as FirebaseFirestore.Timestamp).toDate();
  }

  return val;
}

// Schema`
if (!fs.existsSync(schemaFilePath)) {
  fs.writeFileSync(
    schemaFilePath,
    schemaContent
  );
  console.log(`create  ${path.relative(process.cwd(), schemaFilePath)}`);
} else {
  console.log(`append  ${path.relative(process.cwd(), schemaFilePath)}`);
}

const schemaStub = `
export const ${modelName}Schema = z.object({
  createdAt: z.preprocess(firestoreTimestampToDate, z.date()).optional(),
  updatedAt: z.preprocess(firestoreTimestampToDate, z.date()).optional(),
});
`;

fs.appendFileSync(schemaFilePath, schemaStub);
