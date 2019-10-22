import { useEffect, useState } from 'react'
import { request } from 'graphql-request'
import humanize from 'humanize-graphql-response'

import { QUERIES } from '../../enum'

export const GraphqlFetchById = (domain, id, url) => {
  const [doFetch, setDoFetch] = useState(false)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setError(false)
      setInfo(false)
      setLoading(true)

      try {
        const response = await request(`${url}/graphql`, QUERIES[domain], { id: id })

        setData(humanize(response[domain + 'ById']))
      } catch (error) {
        if (error.response.hasOwnProperty('errors') && error.response.hasOwnProperty('data')) {
          setData(humanize(error.response.data[domain + 'ById']))
          setInfo(error.response.errors)
        } else {
          setError(error.toString())
        }
      }

      setLoading(false)
    }

    if (doFetch) {
      fetchData().then()
    }
  }, [domain, id, url, doFetch])

  return [{ data, loading, info, error }, setDoFetch]
}
