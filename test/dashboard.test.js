const test = require("node:test");
const assert = require("node:assert/strict");
const { ORDERS, aggregateRevenueByDay, formatCurrency, summarizeOrders } = require("../app.js");

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

test("aggregateRevenueByDay combines same-day orders and sorts dates", () => {
  const trend = aggregateRevenueByDay([
    { date: "2026-11-12", total: 15 },
    { date: "2026-11-11", total: 20 },
    { date: "2026-11-12", total: 25 }
  ]);
  assert.deepEqual(trend, [
    { date: "2026-11-11", revenue: 20 },
    { date: "2026-11-12", revenue: 40 }
  ]);
});

test("aggregateRevenueByDay keeps only the latest requested dates", () => {
  const trend = aggregateRevenueByDay(ORDERS, 3);
  assert.equal(trend.length, 3);
  assert.equal(trend.at(-1).date, "2026-11-12");
});
