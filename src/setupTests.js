import '@testing-library/jest-dom/extend-expect'

jest.mock('react-ace')
jest.mock('graphql-request', () => ({ request: jest.fn() }))
jest.mock('react-chartjs-2', () => ({
  Bar: () => null,
  Doughnut: () => null,
  Pie: () => null
}))
