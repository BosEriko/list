#!/usr/bin/env node
import fs from "fs";
import path from "path";
import pluralize from "pluralize";

// --- 1️⃣ Get scaffold name ---
const scaffoldName = process.argv[2];
if (!scaffoldName) {
  console.error("Usage: yarn generate:scaffold <Name>");
  console.error("Example: yarn generate:scaffold UserActivity");
  process.exit(1);
}

function toSnakeCase(name: string) {
  const snake = name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
  return pluralize(snake);
}

const camelName = scaffoldName.charAt(0).toUpperCase() + scaffoldName.slice(1); // for controller names
const snakePluralName = toSnakeCase(scaffoldName);

// --- 2️⃣ Paths ---
const controllerDir = path.join("app", "(controller)", camelName);
const apiDir = path.join("app", "api", snakePluralName);
const apiIdDir = path.join(apiDir, "[id]");

// --- 3️⃣ Action files ---
const actions = ["index", "show", "create", "update", "destroy"];

fs.mkdirSync(controllerDir, { recursive: true });
actions.forEach((action) => {
  const filePath = path.join(controllerDir, "actions", `${action}_action.ts`);
  const content = `export default async function ${action}_action(req: Request, id?: string) {
  return new Response(JSON.stringify({ message: "${action} ${camelName}" }));
}
`;
  fs.writeFileSync(filePath, content);
  console.log(`create  ${path.relative(process.cwd(), filePath)}`);
});

// --- 4️⃣ index.ts for controller ---
const indexContent = actions
  .map((action) => `import ${action}_action from "./actions/${action}_action";`)
  .join("\n") +
  `

export default {
${actions.map((a) => `  ${a}_action,`).join("\n")}
};
`;

fs.writeFileSync(path.join(controllerDir, "index.ts"), indexContent);
console.log(`create  ${path.relative(process.cwd(), path.join(controllerDir, "index.ts"))}`);

// --- 5️⃣ API route.ts ---
fs.mkdirSync(apiDir, { recursive: true });
const apiRouteContent = `/**
 * Standard RESTful Routes
 *
 * | HTTP Verb | Controller#Action | Purpose          | Path |
 * |-----------|-------------------|------------------|------|
 * | GET       | index             | List all         | /${snakePluralName}
 * | GET       | show              | Get one          | /${snakePluralName}/:id
 * | POST      | create            | Create           | /${snakePluralName}
 * | PATCH     | update            | Update (partial) | /${snakePluralName}/:id
 * | PUT       | update            | Update (full)    | /${snakePluralName}/:id
 * | DELETE    | destroy           | Delete           | /${snakePluralName}/:id
 */

import ${camelName}Controller from "@controller/${camelName}";

export async function GET(req: Request) {
  return ${camelName}Controller.index_action(req);
}

export async function POST(req: Request) {
  return ${camelName}Controller.create_action(req);
}
`;

fs.writeFileSync(path.join(apiDir, "route.ts"), apiRouteContent);
console.log(`create  ${path.relative(process.cwd(), path.join(apiDir, "route.ts"))}`);

// --- 6️⃣ API [id]/route.ts ---
fs.mkdirSync(apiIdDir, { recursive: true });
const apiIdRouteContent = `import ${camelName}Controller from "@controller/${camelName}";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  return ${camelName}Controller.show_action(req, params.id);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return ${camelName}Controller.update_action(req, params.id);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return ${camelName}Controller.update_action(req, params.id);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return ${camelName}Controller.destroy_action(req, params.id);
}
`;

fs.writeFileSync(path.join(apiIdDir, "route.ts"), apiIdRouteContent);
console.log(`create  ${path.relative(process.cwd(), path.join(apiIdDir, "route.ts"))}`);
