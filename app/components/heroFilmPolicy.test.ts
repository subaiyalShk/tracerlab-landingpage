import { test } from "node:test";
import assert from "node:assert/strict";
import { attachTrigger, pickSource, shouldLoadFilm } from "./heroFilmPolicy";

const ok = { reducedMotion: false, saveData: false, theme: "dark" as const, coarsePointer: false };

test("loads in both themes; bails only on reduced-motion or Save-Data", () => {
  assert.equal(shouldLoadFilm(ok), true);
  assert.equal(shouldLoadFilm({ ...ok, theme: "light" }), true);
  assert.equal(shouldLoadFilm({ ...ok, reducedMotion: true }), false);
  assert.equal(shouldLoadFilm({ ...ok, saveData: true }), false);
});

test("picks the file by orientation and theme", () => {
  assert.equal(pickSource(false, "dark"), "/hero/loop-16x9.mp4");
  assert.equal(pickSource(true, "dark"), "/hero/loop-9x16.mp4");
  assert.equal(pickSource(false, "light"), "/hero/loop-16x9-light.mp4");
  assert.equal(pickSource(true, "light"), "/hero/loop-9x16-light.mp4");
});

test("attaches on first interaction for coarse pointers, idle otherwise", () => {
  assert.equal(attachTrigger({ ...ok, coarsePointer: true }), "interaction");
  assert.equal(attachTrigger({ ...ok, coarsePointer: false }), "idle");
});
