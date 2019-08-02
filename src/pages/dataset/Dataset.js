import React, { Component } from 'react'
import { Header, Message, Segment } from 'semantic-ui-react'

import { LanguageContext } from '../../utilities/context/LanguageContext'
import { ERRORS, UI } from '../../enum'

class Dataset extends Component {
  state = {
    ready: false
  }

  componentDidMount () {
    this.setState({ ready: true })
  }

  render () {
    const { error, ready } = this.state

    let language = this.context.value

    return (
      <Segment basic loading={!ready}>
        {ready && error && <Message negative icon='warning' header={ERRORS.ERROR[language]} content={error} />}
        {ready && !error &&
        <>
          <Header as='h1' icon={{ name: 'search plus', color: 'teal' }} dividing content={UI.DATASET[language]}
                  subheader={`${UI.EXPLORE[language]} ${UI.DATASET[language]}${language === 'en' ? 's' : ''}`} />
        </>
        }
      </Segment>
    )
  }
}

Dataset.contextType = LanguageContext

export default Dataset
