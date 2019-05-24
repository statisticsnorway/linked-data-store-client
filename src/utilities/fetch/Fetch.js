const headers = { 'Content-Type': 'application/json; charset=utf-8' }

// TODO: Implement AbortController in each class using either of these functions to set state.
//  This is to avoid potentially setting state on unmounted components if the user navigates away before a fetch is finished.
//  https://stackoverflow.com/questions/49906437/how-to-cancel-a-fetch-on-componentwillunmount

export const getData = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: headers
    }).then(response => {
      if ((response.status >= 200 && response.status < 300) || response.status === 404) {
        response.json().then(json => resolve(json))
      } else {
        response.text().then(text => reject(text))
      }
    }).catch(error => reject(`${error} (${url})`))
  })
}

export const putData = (url, data) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: headers
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        resolve()
      } else {
        response.text().then(text => reject(`${text} (${url})`))
      }
    }).catch(error => reject(`${error} (${url})`))
  })
}

export const deleteData = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'DELETE',
      headers: headers
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        resolve()
      } else {
        response.text().then(text => reject(`${text} (${url})`))
      }
    }).catch(error => reject(`${error} (${url})`))
  })
}
