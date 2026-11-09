const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const vm = require("node:vm");
const context = { window: {} };
vm.runInNewContext(
  readFileSync(require.resolve("../scripts/multiplication-drawing.js"), "utf8"),
  context,
);
const Drawing = context.window.MultiplicationDrawing;

test("four and 4,095 connections finish in the same 750 ms, with partial-line progress", () => {
  for (const [nodes, count] of [
    [5, 4],
    [4096, 4095],
  ]) {
    const drawing = new Drawing(nodes, 2);
    assert.equal(drawing.connections.length, count);
    drawing.start(100, true);
    assert.equal(drawing.amount(100), 0);
    assert.equal(drawing.amount(475), count / 2);
    assert.ok(drawing.amount(225) % 1 > 0);
    assert.equal(drawing.active(849), true);
    assert.equal(drawing.amount(850), count);
    assert.equal(drawing.active(850), false);
    assert.equal(drawing.amount(10000), count);
  }
});

test("repeated shuffle restarts the reveal; reduced motion completes immediately", () => {
  const drawing = new Drawing(5, 2);
  drawing.start(100, true);
  drawing.start(400, true);
  assert.equal(drawing.amount(400), 0);
  assert.equal(drawing.active(1149), true);
  assert.equal(drawing.active(1150), false);
  drawing.start(500, false);
  assert.equal(drawing.amount(500), 4);
  assert.equal(drawing.active(500), false);
});

test("only distinct visible connections consume drawing time", () => {
  const reversedPairs = new Drawing(8, 7);
  assert.equal(reversedPairs.connections.length, 3);
  assert.deepEqual(
    Array.from(reversedPairs.connections, (c) => c.i),
    [1, 2, 3],
  );
  const selfLoops = new Drawing(8, 1);
  selfLoops.start(100, true);
  assert.equal(selfLoops.connections.length, 0);
  assert.equal(selfLoops.active(100), false);
});
