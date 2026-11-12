const ORDERS = [
  { id: "MS-108", date: "2026-11-12", customer: "Maya Chen", channel: "Online", items: 3, total: 84.5, returning: true },
  { id: "MS-107", date: "2026-11-12", customer: "Dinesh Rao", channel: "In store", items: 1, total: 22, returning: false },
  { id: "MS-106", date: "2026-11-11", customer: "Sofia Tan", channel: "Marketplace", items: 4, total: 118, returning: true },
  { id: "MS-105", date: "2026-11-10", customer: "Aaron Lim", channel: "Online", items: 2, total: 56.4, returning: false },
  { id: "MS-104", date: "2026-11-09", customer: "Nur Aisyah", channel: "In store", items: 5, total: 143.8, returning: true },
  { id: "MS-103", date: "2026-11-08", customer: "Jamie Koh", channel: "Online", items: 2, total: 67, returning: true },
  { id: "MS-102", date: "2026-11-07", customer: "Priya Nair", channel: "Marketplace", items: 1, total: 31.5, returning: false },
  { id: "MS-101", date: "2026-11-06", customer: "Marcus Lee", channel: "In store", items: 3, total: 92.25, returning: true }
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    maximumFractionDigits: 2
  }).format(value);
}

function summarizeOrders(orders) {
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const returningOrders = orders.filter((order) => order.returning).length;
  return {
    revenue,
    count: orders.length,
    average: orders.length ? revenue / orders.length : 0,
    returningRate: orders.length ? Math.round((returningOrders / orders.length) * 100) : 0
  };
}

function aggregateRevenueByDay(orders, limit = 7) {
  const totals = orders.reduce((days, order) => {
    days.set(order.date, (days.get(order.date) || 0) + order.total);
    return days;
  }, new Map());
  return [...totals.entries()]
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((first, second) => first.date.localeCompare(second.date))
    .slice(-limit);
}

function renderRevenueTrend(orders = ORDERS) {
  const dailyRevenue = aggregateRevenueByDay(orders);
  const maximum = Math.max(...dailyRevenue.map((day) => day.revenue), 1);
  const strongestDay = dailyRevenue.reduce((best, day) => day.revenue > best.revenue ? day : best, dailyRevenue[0]);
  document.querySelector("#trendSummary").textContent = strongestDay
    ? `Best day ${formatCurrency(strongestDay.revenue)}`
    : "No sales yet";
  document.querySelector("#revenueTrend").innerHTML = dailyRevenue.map((day) => {
    const label = new Intl.DateTimeFormat("en-SG", { weekday: "short", timeZone: "Asia/Singapore" }).format(new Date(`${day.date}T12:00:00+08:00`));
    const height = Math.max(4, Math.round((day.revenue / maximum) * 100));
    return `
      <li class="revenue-day" aria-label="${day.date}: ${formatCurrency(day.revenue)}">
        <span class="revenue-bar-wrap" aria-hidden="true"><span class="revenue-bar" style="height: ${height}%"></span></span>
        <strong>${formatCurrency(day.revenue)}</strong>
        <time datetime="${day.date}">${label}</time>
      </li>
    `;
  }).join("");
}

function renderOrders(orders = ORDERS) {
  const summary = summarizeOrders(orders);
  document.querySelector("#revenueMetric").textContent = formatCurrency(summary.revenue);
  document.querySelector("#ordersMetric").textContent = String(summary.count);
  document.querySelector("#averageMetric").textContent = formatCurrency(summary.average);
  document.querySelector("#returningMetric").textContent = `${summary.returningRate}%`;
  document.querySelector("#orderCount").textContent = `${summary.count} ${summary.count === 1 ? "order" : "orders"}`;

  document.querySelector("#ordersBody").innerHTML = orders.map((order) => `
    <tr>
      <td><span class="order-id">${order.id}</span><span class="order-date">${order.date}</span></td>
      <td>${order.customer}</td>
      <td>${order.channel}</td>
      <td>${order.items}</td>
      <td>${formatCurrency(order.total)}</td>
    </tr>
  `).join("");
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    renderOrders();
    renderRevenueTrend();
  });
}

if (typeof module !== "undefined") {
  module.exports = { ORDERS, aggregateRevenueByDay, formatCurrency, summarizeOrders };
}
