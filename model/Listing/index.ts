import create from "./create";
import read from "./read";
import update from "./update";
import delete from "./delete";

// TODO: Follow rails pattern
// - create
// - find
// - find_by
// - where
// - all
// - update
// - destroy (instead of selecting the model first, just pass id on destroy)

export default { create, read, update, delete };
