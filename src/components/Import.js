import React, { Component } from 'react'
import { Button, Divider, List, Progress, Statistic } from 'semantic-ui-react'

import { extractObjectNameFromFilename } from '../utilities/Common'
import { putData } from '../utilities/Fetch'
import { MESSAGES, UI } from '../utilities/Enum'

class Import extends Component {
  constructor (props) {
    super(props)

    this.fileUploader = React.createRef()

    this.state = {
      ready: false,
      progressObjects: 0,
      totalObjects: 0,
      successfulObjectUploads: 0,
      responses: []
    }
  }

  handleUploadInput (event) {
    const {languageCode} = this.props
    const files = event.target.files
    const length = files.length

    this.reset().then(() => {
      this.setState({
        totalObjects: length,
        ready: true
      }, () => {
        for (let i = 0, l = length; i < l; i++) {
          const file = files[i]

          if (file.type === 'application/json') {
            this.handleFile(file)
          } else {
            this.setState(prevState => ({
              responses: [...prevState.responses, {
                color: 'red',
                name: file.name,
                icon: 'warning',
                text: MESSAGES.INVALID_FORMAT[languageCode]
              }]
            }))
          }
        }
      })
    })
  }

  handleFile (file) {
    const {languageCode} = this.props

    let fileReader

    fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onloadend = () => {
      try {
        const domain = extractObjectNameFromFilename(file.name)
        const data = JSON.parse(fileReader.result)

        if (Array.isArray(data)) {
          let length = data.length

          this.setState(prevState => ({totalObjects: prevState.totalObjects - 1}))

          data.forEach((value, index) => {
            const filename = '(' + index + 1 + '/' + length + ') ' + file.name

            this.setState(prevState => ({totalObjects: prevState.totalObjects + 1}))

            this.saveDataFromFileToBackend(domain, value, filename)
          })
        } else {
          this.saveDataFromFileToBackend(domain, data, file.name)
        }
      } catch (error) {
        this.setState(prevState => ({
          progressObjects: prevState.progressObjects + 1,
          responses: [...prevState.responses, {
            color: 'red',
            name: file.name,
            icon: 'warning',
            text: MESSAGES.INVALID_JSON[languageCode]
          }]
        }))
      }
    }
  }

  reset = () => {
    return new Promise((resolve) => {
      this.setState({
        ready: false,
        progressObjects: 0,
        totalObjects: 0,
        successfulObjectUploads: 0,
        responses: []
      }, () => {
        resolve()
      })
    })
  }

  checkData (data) {
    return new Promise((resolve, reject) => {
      const {languageCode} = this.props

      if (!data.hasOwnProperty('id')) {
        reject(MESSAGES.MISSING_ID[languageCode])
      }

      const length = Object.keys(data).length

      let counter = 0

      Object.keys(data).forEach(key => {
        if (key.charAt(0) === key.charAt(0).toUpperCase()) {
          reject(MESSAGES.PROPERTY_ERROR_CASE[languageCode])
        }

        counter++

        if (counter === length) {
          resolve()
        }
      })
    })
  }

  setResponseError = (filename, error) => {
    this.setState(prevState => ({
      responses: [...prevState.responses, {
        color: 'red',
        name: filename,
        icon: 'warning',
        text: error
      }],
      progressObjects: prevState.progressObjects + 1
    }))
  }

  saveDataFromFileToBackend (domain, data, filename) {
    const {endpoint, languageCode} = this.props

    this.checkData(data).then(() => {
      putData(endpoint + 'data/' + domain + '/' + data.id, endpoint, data, languageCode).then(() => {
        this.setState(prevState => ({
          responses: [...prevState.responses, {color: 'green', name: filename, icon: 'check', text: ''}],
          progressObjects: prevState.progressObjects + 1,
          successfulObjectUploads: prevState.successfulObjectUploads + 1
        }))
      }).catch(error => {
        this.setResponseError(filename, error)
      })
    }).catch(error => {
      this.setResponseError(filename, error)
    })
  }

  uploadButtonClick = () => {
    this.fileUploader.current.click()
  }

  render () {
    const {ready, progressObjects, totalObjects, successfulObjectUploads, responses} = this.state
    const {languageCode} = this.props

    return (
      <div>
        <Button size='large' color='teal' icon='upload' content={UI.UPLOAD[languageCode]}
                onClick={this.uploadButtonClick} />
        <input ref={this.fileUploader} type='file' multiple onChange={(event) => {this.handleUploadInput(event)}}
               style={{display: 'none'}} accept='application/json' />
        <Divider hidden />

        {ready && <Progress active={progressObjects !== totalObjects} success={progressObjects === totalObjects}
                            label={progressObjects === totalObjects ? UI.IMPORTING_DONE[languageCode] : UI.IMPORTING[languageCode]}
                            percent={progressObjects / totalObjects * 100} />
        }

        {ready && progressObjects === totalObjects &&
        <div>
          <Statistic.Group size='small' widths='one'>
            <Statistic color={successfulObjectUploads === totalObjects ? 'green' : 'red'}>
              <Statistic.Value>{successfulObjectUploads} / {totalObjects}</Statistic.Value>
              <Statistic.Label>{UI.IMPORTING_SUCCESS[languageCode]}</Statistic.Label>
            </Statistic>
          </Statistic.Group>

          <Divider fitted hidden />

          <List>
            {Object.keys(responses).map(key => {
              if (responses[key].color !== 'green') {
                return (
                  <List.Item key={key}>
                    <List.Icon name={responses[key].icon} color={responses[key].color} />
                    <List.Content>
                      {responses[key].name} <i>- {responses[key].text}</i>
                    </List.Content>
                  </List.Item>
                )
              }

              return null
            })}
          </List>
        </div>
        }
      </div>
    )
  }
}

export default Import
