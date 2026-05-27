const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function safeFetch(url: string) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error("API Error:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    return [];
  }
}

export async function getUsers() {
  const data = await safeFetch(`${API_BASE_URL}/users`);
  return Array.isArray(data) ? data : [];
}

export async function getProducts() {
  const data = await safeFetch(`${API_BASE_URL}/products`);
  return Array.isArray(data) ? data : [];
}

export async function getOrders() {
  const data = await safeFetch(`${API_BASE_URL}/orders`);
  return Array.isArray(data) ? data : [];
}

export async function getOrderItems() {
  const data = await safeFetch(`${API_BASE_URL}/order-items`);
  return Array.isArray(data) ? data : [];
}

export async function getDashboardSummary() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/summary`);

    if (!res.ok) throw new Error("Dashboard summary failed");

    return await res.json();
  } catch (error) {
    console.error(error);
    return {
      total_users: 0,
      total_products: 0,
      total_orders: 0,
      total_sales: 0,
    };
  }
}

export async function searchAnalytics(keyword: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/search/analytics?keyword=${keyword}`
    );

    if (!res.ok) throw new Error("Search failed");

    return await res.json();
  } catch (error) {
    console.error(error);
    return {
      keyword,
      products_count: 0,
      orders_count: 0,
      users_count: 0,
      total_quantity: 0,
      total_sales: 0,
      products: [],
      orders: [],
      order_items: [],
    };
  }
}