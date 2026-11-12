const test = require("node:test");
const assert = require("node:assert/strict");
const {
  DEFAULT_REVENUE_GOAL,
  ORDERS,
  calculateGoalProgress,
  formatCurrency,
  parseRevenueGoal,
  summarizeOrders
} = require("../app.js");

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

test("parseRevenueGoal accepts positive values and rejects invalid storage", () => {
  assert.equal(parseRevenueGoal("1200"), 1200);
  assert.equal(parseRevenueGoal("not-a-number"), DEFAULT_REVENUE_GOAL);
  assert.equal(parseRevenueGoal("-4"), DEFAULT_REVENUE_GOAL);
});

test("calculateGoalProgress rounds and caps the displayed percentage", () => {
  assert.equal(calculateGoalProgress(615, 750), 82);
  assert.equal(calculateGoalProgress(900, 750), 100);
  assert.equal(calculateGoalProgress(20, 0), 0);
});
