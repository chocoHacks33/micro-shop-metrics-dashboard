const test = require("node:test");
const assert = require("node:assert/strict");
const { ORDERS, formatCurrency, summarizeChannels, summarizeOrders } = require("../app.js");

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

test("summarizeChannels ranks channels by revenue and calculates their share", () => {
  const channels = summarizeChannels([
    { channel: "Online", total: 30 },
    { channel: "In store", total: 50 },
    { channel: "Online", total: 20 }
  ]);

  assert.deepEqual(channels, [
    { channel: "In store", orders: 1, revenue: 50, share: 50 },
    { channel: "Online", orders: 2, revenue: 50, share: 50 }
  ]);
});

test("summarizeChannels handles empty and zero-revenue data", () => {
  assert.deepEqual(summarizeChannels([]), []);
  assert.deepEqual(summarizeChannels([{ channel: "Online", total: 0 }]), [
    { channel: "Online", orders: 1, revenue: 0, share: 0 }
  ]);
});
