// src/components/DashboardChart.tsx
// src/components/DashboardChart.tsx
import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type DashboardChartProps = {
  messagesData: { date: string; messages: number }[];
  modelUsage: { model: string; usage: number }[];
};

const DashboardChart: React.FC<DashboardChartProps> = ({ messagesData, modelUsage }) => {
  const lineChartData = {
    labels: messagesData.map(d => d.date),
    datasets: [
      {
        label: "Messages Sent",
        data: messagesData.map(d => d.messages),
        fill: true,
        borderColor: "#19c37d",
        backgroundColor: "rgba(25, 195, 125, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: modelUsage.map(d => d.model),
    datasets: [
      {
        label: "Model Usage",
        data: modelUsage.map(d => d.usage),
        backgroundColor: "#19c37d",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#ffffff" },
      },
    },
    scales: {
      x: { ticks: { color: "#ccc" } },
      y: { ticks: { color: "#ccc" } },
    },
  };

  return (
    <div className="charts-row">
      <div className="chart-card">
        <h4 style={{ color: "#fff", marginBottom: "10px" }}>Messages Over Time</h4>
        <div style={{ height: "140px", maxHeight: "160px" }}>
        <Line data={lineChartData} options={chartOptions} />
        </div>

      </div>
      <div className="chart-card">
        <h4 style={{ color: "#fff", marginBottom: "10px" }}>Model Usage Breakdown</h4>
        <div style={{ height: "140px", maxHeight: "160px" }}>
        <Bar data={barChartData} options={chartOptions} />
        </div>

      </div>
    </div>
  );
};

export default DashboardChart;
