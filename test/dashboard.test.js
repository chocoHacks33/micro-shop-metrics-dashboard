const test = require("node:test");
const assert = require("node:assert/strict");
const { ORDERS, formatCurrency, summarizeOrders } = require("../app.js");

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
