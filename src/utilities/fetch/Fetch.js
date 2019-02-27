export const getData = (url, timeout = 3000) => {
  return new Promise((resolve, reject) => {
    const controller = new AbortController()

    let timer = setTimeout(() => {
      controller.abort()
      reject(`Timeout: (${url})`)
    }, timeout)

    fetch(url, {
      signal: controller.signal,
      method: 'GET',
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    }).then(response => {
      if (response.ok) {
        response.json().then(json => resolve(json))
      } else if (response.status === 404) {
        // This must be done since LDS does not return an empty array
        resolve([])
      } else {
        response.text().then(text => reject(text))
      }
    }).catch(error => reject(`${error} (${url})`)
    ).finally(() => clearTimeout(timer))
  })
}

export const putData = (url, data, timeout = 3000) => {
  return new Promise((resolve, reject) => {
    const controller = new AbortController()

    let timer = setTimeout(() => {
      controller.abort()
      reject(`Timeout: (${url})`)
    }, timeout)

    fetch(url, {
      signal: controller.signal,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    }).then(response => {
      if (response.ok) {
        resolve()
      } else {
        response.text().then(text => reject(`${text} (${url})`))
      }
    }).catch(error => reject(`${error} (${url})`)
    ).finally(() => clearTimeout(timer))
  })
}

export const deleteData = (url, data, timeout = 3000) => {
  return new Promise((resolve, reject) => {
    const controller = new AbortController()

    let timer = setTimeout(() => {
      controller.abort()
      reject(`Timeout: (${url})`)
    }, timeout)

    fetch(url, {
      signal: controller.signal,
      method: 'DELETE',
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    }).then(response => {
      if (response.ok) {
        response.json().then(json => resolve(json))
      } else {
        response.text().then(text => reject(`${text} (${url})`))
      }
    }).catch(error => reject(`${error} (${url})`)
    ).finally(() => clearTimeout(timer))
  })
}
