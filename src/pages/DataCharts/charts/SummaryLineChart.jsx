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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {getSundayDates} from "../calculation.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' ,
        },
        title: {
            display: true,
            text: 'Monthly Summary',
        },
    },
};

const labels = getSundayDates();

export const data = {
    labels,
    datasets: [
        {
            label: 'CG Numbering',
            data:  [65, 59, 80, 81,111],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Service Attend',
            data: [28, 48, 40, 19, 86 ],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'New Friends',
            data: [12, 33, 44, 11, 44 ],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
            label: 'Monthly Salvation',
            data: [22, 13, 231, 123, 45 ],
            borderColor: 'rgb(252, 196, 25)',
            backgroundColor: 'rgba(252, 196, 25, 0.5)',
        }
    ],
};


export default  function SummaryLineChart(){
    return <Line options={options} data={data} height={100} />;
}
