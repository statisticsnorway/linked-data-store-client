import '@testing-library/jest-dom/extend-expect'

jest.mock('react-ace')
jest.mock('react-chartjs-2', () => ({
  Bar: () => null,
  Doughnut: () => null,
  Pie: () => null
}))

window._env = {
  REACT_APP_API: process.env.REACT_APP_API
}
