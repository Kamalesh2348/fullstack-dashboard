"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const COLORS = ["#38bdf8", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"];

type Column = {
  key: string;
  label: string;
};

function KPI({ label, value }: { label: string; value: any }) {
  return (
    <div className="kpi-card">
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  );
}

function getPieData(data: any[], key: string) {
  const count: Record<string, number> = {};

  data.forEach((item) => {
    const name = String(item[key] ?? "Unknown");
    count[name] = (count[name] || 0) + 1;
  });

  return Object.entries(count)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  });

  if (!res.ok) {
    console.error("API Error:", url, res.status);
    return [];
  }

  try {
    return await res.json();
  } catch (error) {
    console.error("JSON Parse Error:", error);
    return [];
  }
}

function DataTable({
  title,
  data,
  columns,
  chartKey,
}: {
  title: string;
  data: any[];
  columns: Column[];
  chartKey: string;
}) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const columnMatch = columns.every((col) => {
        const value = filters[col.key];

        if (!value || value.trim() === "") return true;

        return String(row[col.key] ?? "")
          .toLowerCase()
          .includes(value.toLowerCase());
      });

      if (!columnMatch) return false;

      if (title === "Orders Table") {
        const orderDate = row.order_date
          ? new Date(row.order_date).toISOString().slice(0, 10)
          : "";

        if (fromDate && orderDate < fromDate) return false;
        if (toDate && orderDate > toDate) return false;
      }

      return true;
    });
  }, [data, filters, columns, title, fromDate, toDate]);

  useEffect(() => {
    setPage(0);
  }, [filters, fromDate, toDate, data]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const safePage = Math.min(page, totalPages - 1);

  const currentData = filteredData.slice(
    safePage * pageSize,
    safePage * pageSize + pageSize
  );

  const chartData = getPieData(filteredData, chartKey);

  return (
    <section className="table-card">
      <div className="table-head">
        <div>
          <h2>{title}</h2>
          <p>{filteredData.length} records found</p>
        </div>
      </div>

      <div className="table-filter-grid">
        {columns.map((col) => (
          <input
            key={col.key}
            type="text"
            placeholder={`Filter by ${col.label}`}
            value={filters[col.key] ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                [col.key]: e.target.value,
              }))
            }
          />
        ))}

        <button type="button" onClick={() => setFilters({})}>
          Clear Filters
        </button>
      </div>

      {title === "Orders Table" && (
        <div className="date-filter-row">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <button
            type="button"
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
          >
            Clear Date
          </button>
        </div>
      )}

      <div className="table-kpi-grid">
        <KPI label="Total Records" value={data.length} />
        <KPI label="Filtered Records" value={filteredData.length} />
        <KPI label="Current Page" value={`${safePage + 1}/${totalPages}`} />
      </div>

      <div className="chart-card">
        <h3>{title} Chart</h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={95}
              label
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, index) => (
                <tr key={row.id ?? index}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.key.includes("amount") ||
                      col.key.includes("price")
                        ? `₹${Number(row[col.key] ?? 0).toFixed(2)}`
                        : String(row[col.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty" colSpan={columns.length}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="slider-buttons">
        <button
          type="button"
          disabled={safePage === 0}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        >
          ← Previous 10
        </button>

        <strong>
          Page {safePage + 1} / {totalPages}
        </strong>

        <button
          type="button"
          disabled={safePage >= totalPages - 1}
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, totalPages - 1))
          }
        >
          Next 10 →
        </button>
      </div>
    </section>
  );
}

export default function Home() {
  const [dark, setDark] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [usersData, productsData, ordersData, orderItemsData] =
        await Promise.all([
          fetchJson(`${API_BASE}/users`),
          fetchJson(`${API_BASE}/products`),
          fetchJson(`${API_BASE}/orders`),
          fetchJson(`${API_BASE}/order-items`),
        ]);

      setUsers(Array.isArray(usersData) ? usersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setOrderItems(Array.isArray(orderItemsData) ? orderItemsData : []);
    }

    fetchData();
  }, []);

  const totalSales = orders.reduce(
    (sum, order) => sum + Number(order.total_amount ?? 0),
    0
  );

  return (
    <div className={dark ? "dark-mode" : ""}>
      <main className="app">
        <nav className="top-nav">
          <h1 className="brand">Fullstack Dashboard</h1>

          <button
            type="button"
            className="theme-btn"
            onClick={() => setDark((prev) => !prev)}
          >
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>
        </nav>

        <section className="hero">
          <h1>Business Analytics Dashboard</h1>
          <p>Users, products, orders and order items in one single page.</p>
        </section>

        <section className="kpi-grid">
          <KPI label="Total Users" value={users.length} />
          <KPI label="Total Products" value={products.length} />
          <KPI label="Total Orders" value={orders.length} />
          <KPI label="Total Sales" value={`₹${totalSales.toFixed(2)}`} />
        </section>

        <DataTable
          title="Users Table"
          data={users}
          chartKey="role"
          columns={[
            { key: "id", label: "ID" },
            { key: "full_name", label: "Full Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
          ]}
        />

        <DataTable
          title="Products Table"
          data={products}
          chartKey="category"
          columns={[
            { key: "id", label: "ID" },
            { key: "product_name", label: "Product Name" },
            { key: "category", label: "Category" },
            { key: "price", label: "Price" },
            { key: "stock_quantity", label: "Stock Quantity" },
          ]}
        />

        <DataTable
          title="Orders Table"
          data={orders}
          chartKey="order_status"
          columns={[
            { key: "id", label: "ID" },
            { key: "user_id", label: "User ID" },
            { key: "order_status", label: "Status" },
            { key: "total_amount", label: "Total Amount" },
            { key: "order_date", label: "Order Date" },
          ]}
        />

        <DataTable
          title="Order Items Table"
          data={orderItems}
          chartKey="product_id"
          columns={[
            { key: "id", label: "ID" },
            { key: "order_id", label: "Order ID" },
            { key: "product_id", label: "Product ID" },
            { key: "quantity", label: "Quantity" },
            { key: "unit_price", label: "Unit Price" },
          ]}
        />
      </main>
    </div>
  );
}