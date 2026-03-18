import create from "./create";
import find from "./find";
import update from "./update";
import destroy from "./destroy";

// TODO: Follow rails pattern
// - create
// - find
// - find_by <- not existing
// - where <- not existing
// - all <- not existing
// - update
// - destroy (instead of selecting the model first, just pass id on destroy)

export default { create, find, update, destroy };
