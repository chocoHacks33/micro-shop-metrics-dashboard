const test = require("node:test");
const assert = require("node:assert/strict");
const { INVENTORY, ORDERS, formatCurrency, getLowStockItems, summarizeOrders } = require("../app.js");

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

test("getLowStockItems finds products at or below their reorder point", () => {
  const alerts = getLowStockItems(INVENTORY);
  assert.deepEqual(alerts.map((item) => item.sku), ["TEA-05", "STM-03", "CDR-01"]);
  assert.ok(alerts.every((item) => item.stock <= item.reorderPoint));
});

test("getLowStockItems does not mutate the inventory list", () => {
  const items = [
    { stock: 3, reorderPoint: 3 },
    { stock: 1, reorderPoint: 2 }
  ];
  getLowStockItems(items);
  assert.equal(items[0].stock, 3);
});
