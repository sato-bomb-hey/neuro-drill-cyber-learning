import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import type { ScoreRecord } from '../../types/game'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface RadarChartProps {
  scoreHistory: ScoreRecord[]
}

const SUBJECT_LABELS: Record<string, string> = {
  math: '数学',
  english: '英語',
  japanese: '国語',
  science: '理科',
  social: '社会',
}

export function RadarChart({ scoreHistory }: RadarChartProps) {
  const subjects = ['math', 'english', 'japanese', 'science', 'social']

  const averages = subjects.map((subject) => {
    const records = scoreHistory.filter((r) => r.subject === subject)
    if (records.length === 0) return 0
    const avg = records.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) / records.length
    return Math.round(avg)
  })

  const data = {
    labels: subjects.map((s) => SUBJECT_LABELS[s]),
    datasets: [
      {
        label: '正答率 (%)',
        data: averages,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderColor: '#00d4ff',
        borderWidth: 2,
        pointBackgroundColor: '#00ff9d',
        pointBorderColor: '#00d4ff',
        pointRadius: 5,
      },
    ],
  }

  const options = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          color: 'rgba(0, 212, 255, 0.5)',
          backdropColor: 'transparent',
          font: { family: 'Share Tech Mono', size: 10 },
        },
        grid: { color: 'rgba(0, 212, 255, 0.15)' },
        angleLines: { color: 'rgba(0, 212, 255, 0.2)' },
        pointLabels: {
          color: '#00d4ff',
          font: { family: 'Share Tech Mono', size: 12 },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#00d4ff',
          font: { family: 'Share Tech Mono', size: 11 },
        },
      },
    },
  }

  return <Radar data={data} options={options} />
}
