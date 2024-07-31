import { Chart } from './Chart.jsx'

export function Dashboard() {
  const companies = ['Sony', 'Nintendo', 'Microsoft']
  return (
    <section>
      <h2>Dashboard</h2>
      <Chart companies={companies} />
    </section>
  )
}
