import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js modules inside this isolated file scope
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  labels: string[];
  loaningRates: number[];
  repaymentRates: number[];
}

const DashboardChart: React.FC<ChartProps> = ({ labels, loaningRates, repaymentRates }) => {
  const graphDataConfig = {
    labels: labels,
    datasets: [
      {
        label: 'Disbursement Volume ($)',
        data: loaningRates,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Collected Capital ($)',
        data: repaymentRates,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  };

  return (
    <div style={{ height: '350px', position: 'relative', width: '100%' }}>
      <Line data={graphDataConfig} options={options} />
    </div>
  );
};

export default DashboardChart;
