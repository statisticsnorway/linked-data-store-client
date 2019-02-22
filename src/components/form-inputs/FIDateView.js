import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import { Divider, Form, Icon, Input, Popup } from 'semantic-ui-react'

import { truncateString } from '../../utilities'
import { MESSAGES, UI } from '../../enum'

const style = {outline: '1px solid #00b5ad', outlineOffset: '2px'}

class FIDateView extends Component {
  convertDate = (date) => {
    if (date !== null && typeof date === 'string') {
      return new Date(date)
    } else {
      return date
    }
  }

  render () {
    const {error, languageCode, outline, uiSchema, value} = this.props
    const {addItem, removeItem, mergeShallowChange, mergeDeepChange, showOutline, hideOutlines} = this.props

    return (
      <Form.Field required={uiSchema.input.required} error={!!error}>
        <label>
          {`${uiSchema.displayName} `}
          {uiSchema.input.multiple &&
          <Popup basic flowing trigger={<Icon link name='copy outline' color='green' onClick={addItem} />}>
            <Icon color='blue' name='info circle' />
            {MESSAGES.ADD_ITEM[languageCode]}
          </Popup>
          }
        </label>
        {!uiSchema.input.multiple &&
        <DatePicker todayButton={UI.TODAY[languageCode]} dateFormat={UI.DATE_FORMAT[languageCode]} showWeekNumbers
                    customInput={<CustomDateInput index={-1} outline={outline} />}
                    placeholderText={truncateString(uiSchema.displayName)} selected={this.convertDate(value)}
                    onChange={date => mergeShallowChange(date)} />
        }
        {uiSchema.input.multiple && value.map((entry, index) =>
          <div key={index}>
            <DatePicker todayButton={UI.TODAY[languageCode]} dateFormat={UI.DATE_FORMAT[languageCode]} showWeekNumbers
                        customInput={<CustomDateInput index={index} outline={outline} />}
                        placeholderText={truncateString(uiSchema.displayName)} selected={this.convertDate(entry)}
                        onChange={date => mergeDeepChange(index, date)} />
            <Popup basic flowing
                   trigger={<Icon link name='delete' color='red' onClick={removeItem.bind(this, index)}
                                  onMouseOut={hideOutlines} onMouseOver={showOutline.bind(this, index)} />}>
              <Icon color='blue' name='info circle' />
              {MESSAGES.REMOVE_ITEM[languageCode]}
            </Popup>
            <Divider hidden style={{marginBottom: 0}} />
          </div>
        )}
      </Form.Field>
    )
  }
}

class CustomDateInput extends Component {
  render () {
    const {index, onClick, outline, value} = this.props

    return <Input style={outline === index ? style : {}} icon={{name: 'calendar alternate outline', color: 'teal'}}
                  iconPosition='left' value={value} onClick={onClick} />
  }
}

export default FIDateView
