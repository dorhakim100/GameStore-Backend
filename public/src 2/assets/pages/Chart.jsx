import { React } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import faker from 'faker'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getAllGames } from '../../store/actions/game.actions.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function Chart({ companies }) {
  const games = useSelector((storeState) => storeState.gameModule.games)

  useEffect(() => {
    getAllGames()
  }, [])

  //   const labels = useSelector((storeState) => storeState.gameModule.games)
  const labels = companies
  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        // display: true,
        text: 'Our game companies',
      },
    },
  }
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  return <Bar options={options} data={data} />
}
