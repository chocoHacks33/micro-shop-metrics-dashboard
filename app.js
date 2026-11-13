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

function renderOrderRow(order) {
  return `
    <tr>
      <td data-label="Order"><span class="cell-value"><span class="order-id">${order.id}</span><span class="order-date">${order.date}</span></span></td>
      <td data-label="Customer"><span class="cell-value">${order.customer}</span></td>
      <td data-label="Channel"><span class="cell-value">${order.channel}</span></td>
      <td data-label="Items"><span class="cell-value">${order.items}</span></td>
      <td data-label="Total"><span class="cell-value">${formatCurrency(order.total)}</span></td>
    </tr>
  `;
}

function renderOrders(orders = ORDERS) {
  const summary = summarizeOrders(orders);
  document.querySelector("#revenueMetric").textContent = formatCurrency(summary.revenue);
  document.querySelector("#ordersMetric").textContent = String(summary.count);
  document.querySelector("#averageMetric").textContent = formatCurrency(summary.average);
  document.querySelector("#returningMetric").textContent = `${summary.returningRate}%`;
  document.querySelector("#orderCount").textContent = `${summary.count} ${summary.count === 1 ? "order" : "orders"}`;

  document.querySelector("#ordersBody").innerHTML = orders.map(renderOrderRow).join("");
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => renderOrders());
}

if (typeof module !== "undefined") {
  module.exports = { ORDERS, formatCurrency, renderOrderRow, summarizeOrders };
}
