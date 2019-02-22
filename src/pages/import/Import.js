import React, { Component } from 'react'

import ImportView from './ImportView'
import { extractDomainFromFilename, putData } from '../../utilities'
import { ERRORS } from '../../enum'

class Import extends Component {
  state = {
    progress: 0,
    ready: false,
    responses: [],
    successful: 0,
    total: 0
  }

  constructor (props) {
    super(props)

    this.fileUploader = React.createRef()
  }

  handleUpload = (event) => {
    const {languageCode} = this.props
    const files = event.target.files

    this.setState({
      ready: true,
      total: files.length
    }, () => {
      Object.keys(files).forEach(file => {
        if (files[file].type !== 'application/json') {
          this.setState(prevState => ({
            progress: prevState.progress + 1,
            responses: [...prevState.responses, {
              name: files[file].name,
              text: ERRORS.INVALID_FORMAT[languageCode]
            }]
          }))
        } else {
          this.handleFile(files[file])
        }
      })
    })
  }

  handleFile = (file) => {
    const {languageCode} = this.props

    let fileReader = new FileReader()

    fileReader.readAsText(file)
    fileReader.onloadend = () => {
      try {
        const domain = extractDomainFromFilename(file.name)
        const data = JSON.parse(fileReader.result)

        if (Array.isArray(data)) {
          data.forEach((item, index) => {
            this.handleImport(item, domain, `(${(index + 1)} / ${data.length}) ${file.name}`)
          })
        } else {
          this.handleImport(data, domain, file.name)
        }
      } catch (error) {
        this.setState(prevState => ({
          progress: prevState.progress + 1,
          responses: [...prevState.responses, {
            name: file.name,
            text: `${ERRORS.PROCESSING_FAILED[languageCode]} (${error.toString()})`
          }]
        }))
      }
    }
  }

  handleImport = (data, domain, filename) => {
    const {lds} = this.props
    const url = `${lds.url}/${lds.namespace}/${domain}/${data.id}`

    putData(url, data).then(() => {
      this.setState(prevState => ({
        progress: prevState.progress + 1,
        successful: prevState.successful + 1
      }))
    }).catch(error => {
      this.setState(prevState => ({
        progress: prevState.progress + 1,
        responses: [...prevState.responses, {
          name: filename,
          text: error
        }]
      }))
    })
  }

  reset = () => {
    window.location.reload()
  }

  handleClick = () => {
    this.fileUploader.current.click()
  }

  render () {
    const {languageCode} = this.props

    return <ImportView {...this.state} languageCode={languageCode} fileUploader={this.fileUploader}
                       handleUpload={this.handleUpload} handleClick={this.handleClick} reset={this.reset} />
  }
}

export default Import
