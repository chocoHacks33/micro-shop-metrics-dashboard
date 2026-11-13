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

function filterOrders(orders, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [...orders];

  return orders.filter((order) => [order.id, order.customer, order.channel, order.date]
    .some((value) => String(value).toLocaleLowerCase().includes(normalizedQuery)));
}

function renderOrders(orders = ORDERS) {
  const summary = summarizeOrders(orders);
  document.querySelector("#revenueMetric").textContent = formatCurrency(summary.revenue);
  document.querySelector("#ordersMetric").textContent = String(summary.count);
  document.querySelector("#averageMetric").textContent = formatCurrency(summary.average);
  document.querySelector("#returningMetric").textContent = `${summary.returningRate}%`;
  document.querySelector("#orderCount").textContent = `${summary.count} ${summary.count === 1 ? "order" : "orders"}`;

  document.querySelector("#ordersBody").innerHTML = orders.length ? orders.map((order) => `
    <tr>
      <td><span class="order-id">${order.id}</span><span class="order-date">${order.date}</span></td>
      <td>${order.customer}</td>
      <td>${order.channel}</td>
      <td>${order.items}</td>
      <td>${formatCurrency(order.total)}</td>
    </tr>
  `).join("") : '<tr><td class="empty-state" colspan="5">No orders match your search.</td></tr>';
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector("#orderSearch");
    searchInput.addEventListener("input", () => renderOrders(filterOrders(ORDERS, searchInput.value)));
    renderOrders();
  });
}

if (typeof module !== "undefined") {
  module.exports = { ORDERS, filterOrders, formatCurrency, summarizeOrders };
}
