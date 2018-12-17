import { MESSAGES } from './Enum'

export function putData (url, endpoint, data, languageCode, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController()
    const signal = controller.signal

    let timer = setTimeout(() => {
      reject(MESSAGES.TIMEOUT[languageCode] + url)
      controller.abort()
    }, timeout)

    fetch(url, {
      signal: signal,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(
          json => resolve(json)
        )
      } else {
        response.text().then(text => {
          reject(text + ' (' + url + ')')
        })
      }
    }).catch(error => {
      reject(MESSAGES.COULD_NOT_CONNECT[languageCode] + '\'' + endpoint + '\' (' + error.toString() + ')')
    }).finally(() =>
      clearTimeout(timer)
    )
  })
}
