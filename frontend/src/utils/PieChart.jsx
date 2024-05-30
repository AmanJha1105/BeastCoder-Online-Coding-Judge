import React from 'react';
import {Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

import { Pie } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
)

const PieChart = ({ data }) => {
  return (
    <div className="mt-10 mx-auto w-52 h-52">
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
