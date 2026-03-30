import fs from "fs";
import path from "path";
import pluralize from "pluralize";

export async function generateModel(modelName: string) {
  if (!modelName) {
    console.error("Usage: yarn generate model <ModelName>");
    console.error("Example: yarn generate model UserActivity");
    process.exit(1);
  }

  // Convert model name to match filename conventions
  const dirName = path.join("app", "(model)", modelName);
  const filePath = path.join(dirName, "index.ts");

  // Pluralize collection name
  const collectionName = pluralize(
    modelName.charAt(0).toLowerCase() + modelName.slice(1)
  );

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
  const dbDir = path.join("db");
  fs.mkdirSync(dbDir, { recursive: true });
  const schemaFilePath = path.join(dbDir, "schema.ts");

  const schemaBaseContent = `import FirebaseAdmin from "@lib/FirebaseAdmin";
import { z } from "zod";

// Helper Function
const FirebaseTimestamp = z.union([
  z.instanceof(FirebaseAdmin.firestore.Timestamp),
  z.date(),
  z.custom((val) => val === FirebaseAdmin.firestore.FieldValue.serverTimestamp(), { message: "Expected serverTimestamp()" }),
]);
`;

  // Ensure schema file exists
  if (!fs.existsSync(schemaFilePath)) {
    fs.writeFileSync(schemaFilePath, schemaBaseContent);
    console.log(`create  ${path.relative(process.cwd(), schemaFilePath)}`);
  } else {
    console.log(`append  ${path.relative(process.cwd(), schemaFilePath)}`);
  }

  const schemaStub = `
// ${modelName} Schema
export const ${modelName}Schema = z.object({
  createdAt: FirebaseTimestamp.optional(),
  updatedAt: FirebaseTimestamp.optional(),
});
export type ${modelName}Type = z.infer<typeof ${modelName}Schema>;
`;

  fs.appendFileSync(schemaFilePath, schemaStub);
}
