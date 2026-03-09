"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function ConstituencyChart() {
    const data = {
        labels: ["NERELA", "BURARI", "TIMARPUR", "ADARSH NAGAR", "BADLI"],
        datasets: [
            {
                label: 'Voting Segments',
                data: [22, 22, 22, 22, 22],
                backgroundColor: '#4F46E5', // Indigo color
                borderRadius: 8,
                barThickness: 32,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const, // Horizontal bar chart
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Hide the standard legend
            },
            tooltip: {
                backgroundColor: '#1f2937',
                titleColor: '#f9fafb',
                bodyColor: '#f9fafb',
                borderColor: '#374151',
                borderWidth: 1,
            }
        },
        scales: {
            x: {
                grid: {
                    display: false, // Hide vertical grid lines
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        family: 'Inter, sans-serif',
                        weight: 'bold' as const
                    }
                },
                border: {
                    display: false,
                }
            },
            y: {
                grid: {
                    color: '#374151',
                },
                ticks: {
                    color: '#cbd5e1',
                    font: {
                        family: 'Inter, sans-serif',
                        weight: 'bold' as const
                    }
                },
                border: {
                    display: false,
                }
            },
        },
    };

    return (
        <div className="w-full h-full bg-[#111827] rounded-3xl p-6 shadow-xl border border-slate-800">
            <h3 className="text-white font-black text-lg uppercase tracking-tight mb-6">Constituency Polling Parts</h3>
            <div className="h-[300px] w-full">
                <Bar options={options} data={data} />
            </div>
        </div>
    );
}
