import React, { useState, useEffect } from "react";
import useFetchUser from "../hooks/useFetchUser";
import { Bar } from "react-chartjs-2";
import axiosInstance from "../utils/axiosInstance";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Home = () => {
  useFetchUser();
  const [productData, setProductData] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const res = await axiosInstance.get("/orders/status");
      const fetchedOrders = res.data.orders;

      setOrders(fetchedOrders.slice(0, 5)); // Show 5 most recent orders

      const productCountMap = {};

      fetchedOrders.forEach(order => {
        order.items.forEach(item => {
          const title = item.title;
          productCountMap[title] = (productCountMap[title] || 0) + item.quantity;
        });
      });

      const sortedProducts = Object.entries(productCountMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5 products

      const labels = sortedProducts.map(([title]) => title);
      const quantities = sortedProducts.map(([, qty]) => qty);
      const maxQty = Math.max(...quantities);

      setProductData({
        labels,
        datasets: [
          {
            label: "Product Purchases",
            data: quantities,
            backgroundColor: [
              "rgba(53, 162, 235, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(255, 159, 64, 0.7)",
              "rgba(255, 99, 132, 0.7)",
              "rgba(153, 102, 255, 0.7)",
            ],
            borderColor: [
              "rgba(53, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
        maxQty,
      });
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard title="Product Purchases" label="Top Ordered" labelColor="green">
            {productData && (
              <Bar
                data={productData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: productData.maxQty,
                      grid: { drawBorder: false, color: "rgba(0,0,0,0.05)" },
                      ticks: { font: { size: 12 }, color: "rgba(0,0,0,0.6)" },
                    },
                    x: {
                      grid: { display: false },
                      ticks: { font: { size: 12 }, color: "rgba(0,0,0,0.6)" },
                    },
                  },
                }}
              />
            )}
          </ChartCard>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
              <button
                onClick={() => navigate("/orders")}
                className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>

            </div>
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Order ID</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Products</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order, i) => (
                    <tr key={order._id || i} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">#{order._id.slice(-6)}</td>
                      <td className="py-3 px-4 text-sm">
                        {order.items.map(item => (
                          <div key={item.productId} className="text-xs">
                            {item.title} × {item.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, label, children, labelColor = "blue" }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className={`bg-${labelColor}-50 text-${labelColor}-600 text-xs font-medium px-3 py-1 rounded-full`}>
        {label}
      </div>
    </div>
    <div className="h-[300px]">{children}</div>
  </div>
);

export default Home;
