/**
 * Standard RESTful Routes
 *
 * | HTTP Verb | Controller#Action | Purpose          | Path                                       |
 * |-----------|-------------------|------------------|--------------------------------------------|
 * | GET       | index             | List all         | /listings
 * | GET       | show              | Get one          | /listings/:id
 * | POST      | create            | Create           | /listings
 * | PATCH     | update            | Update (partial) | /listings/:id
 * | PUT       | update            | Update (full)    | /listings/:id
 * | DELETE    | destroy           | Delete           | /listings/:id
 */

import ListingController from "@controller/Listing";

export async function GET(req: Request) {
  return ListingController.index_action(req);
}

export async function POST(req: Request) {
  return ListingController.create_action(req);
}
