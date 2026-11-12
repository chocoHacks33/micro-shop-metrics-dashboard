const test = require("node:test");
const assert = require("node:assert/strict");
const { ORDERS, buildOrdersCsv, escapeCsvCell, formatCurrency, summarizeOrders } = require("../app.js");

test("seed data includes multiple sales channels", () => {
  assert.deepEqual([...new Set(ORDERS.map((order) => order.channel))].sort(), ["In store", "Marketplace", "Online"]);
});

test("summarizeOrders calculates revenue and average", () => {
  const summary = summarizeOrders([
    { total: 20, returning: true },
    { total: 30, returning: false }
  ]);
  assert.equal(summary.revenue, 50);
  assert.equal(summary.count, 2);
  assert.equal(summary.average, 25);
  assert.equal(summary.returningRate, 50);
});

test("summarizeOrders handles an empty data set", () => {
  assert.deepEqual(summarizeOrders([]), { revenue: 0, count: 0, average: 0, returningRate: 0 });
});

test("formatCurrency uses Singapore dollars", () => {
  assert.match(formatCurrency(42.5), /\$42\.50/);
});

test("escapeCsvCell quotes content and neutralizes spreadsheet formulas", () => {
  assert.equal(escapeCsvCell('Mugs, "large"'), '"Mugs, ""large"""');
  assert.equal(escapeCsvCell("=2+2"), '"\'=2+2"');
  assert.equal(escapeCsvCell("-1+4"), '"\'-1+4"');
});

test("buildOrdersCsv includes a header and one row per order", () => {
  const csv = buildOrdersCsv(ORDERS.slice(0, 2));
  const rows = csv.split("\r\n");
  assert.equal(rows.length, 3);
  assert.match(rows[0], /"Order","Date","Customer"/);
  assert.match(rows[1], /"MS-108"/);
});
