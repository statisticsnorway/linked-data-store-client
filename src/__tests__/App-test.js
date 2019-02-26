import React from 'react'
import { cleanup, render, wait } from 'react-testing-library'
import { MemoryRouter } from 'react-router-dom'

import App from '../App'
import { getData } from '../utilities/fetch/Fetch'

jest.mock('../utilities/fetch/Fetch', () => ({getData: jest.fn()}))

afterEach(cleanup)

const goodResponse = ['/ns/Agent?schema']
const badResponse = 'Error'
const setup = () => {
  const {container, debug} = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )

  return {container, debug}
}

test('App renders correctly with succesful response from fetch', async () => {
  getData.mockImplementation(() => Promise.resolve(goodResponse))

  const {container} = setup()

  await wait(() => {
    const greenIcon = container.querySelector('i.green.circle.icon')
    const agent = container.querySelector('a.item[href="/gsim/Agent"]')

    expect(greenIcon).not.toBeNull()
    expect(agent).not.toBeNull()
  })
})

test('App renders correctly with unsuccesful response from fetch', async () => {
  getData.mockImplementation(() => Promise.reject(badResponse))

  const {container} = setup()

  await wait(() => {
    const redIcon = container.querySelector('i.red.circle.icon')

    expect(redIcon).not.toBeNull()
  })
})
