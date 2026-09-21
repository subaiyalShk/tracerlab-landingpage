import { test } from "node:test";
import assert from "node:assert/strict";
import { pickSource, shouldLoadFilm } from "./heroFilmPolicy";

const ok = { reducedMotion: false, saveData: false, theme: "dark" as const };

test("loads only in dark theme with motion allowed and no Save-Data", () => {
  assert.equal(shouldLoadFilm(ok), true);
  assert.equal(shouldLoadFilm({ ...ok, reducedMotion: true }), false);
  assert.equal(shouldLoadFilm({ ...ok, saveData: true }), false);
  assert.equal(shouldLoadFilm({ ...ok, theme: "light" }), false);
});

test("picks the portrait loop for portrait viewports", () => {
  assert.equal(pickSource(true), "/hero/loop-9x16.mp4");
  assert.equal(pickSource(false), "/hero/loop-16x9.mp4");
});
