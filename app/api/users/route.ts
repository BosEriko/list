/**
 * Standard RESTful Routes
 *
 * | HTTP Verb | Controller#Action | Purpose          | Path                                       |
 * |-----------|-------------------|------------------|--------------------------------------------|
 * | GET       | index             | List all         | /users
 * | GET       | show              | Get one          | /users/:id
 * | POST      | create            | Create           | /users
 * | PATCH     | update            | Update (partial) | /users/:id
 * | PUT       | update            | Update (full)    | /users/:id
 * | DELETE    | destroy           | Delete           | /users/:id
 */

import UserController from "@controller/User";

export async function GET(req: Request) {
  return UserController.index_action(req);
}

export async function POST(req: Request) {
  return UserController.create_action(req);
}
