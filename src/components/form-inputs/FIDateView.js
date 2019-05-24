import React, { Component, Fragment } from 'react'
import DatePicker from 'react-datepicker'
import { Divider, Form, Icon, Input, Popup } from 'semantic-ui-react'

import { LanguageContext } from '../../utilities/context/LanguageContext'
import { truncateString } from '../../utilities'
import { MESSAGES, UI } from '../../enum'

const style = { outline: '1px solid #00b5ad', outlineOffset: '2px' }

class FIDateView extends Component {
  render () {
    const { error, outline, uiSchema, value } = this.props
    const { addItem, removeItem, mergeShallowChange, mergeDeepChange, showOutline, hideOutlines } = this.props

    let language = this.context.value

    return (
      <Form.Field required={uiSchema.input.required} error={!!error}>
        <label>
          <Popup basic flowing trigger={<span>{`${uiSchema.displayName} `}</span>}>
            <Icon color='blue' name='info circle' />
            {uiSchema.description}
          </Popup>
          {uiSchema.input.multiple &&
          <Popup basic flowing trigger={<Icon link name='copy outline' color='green' onClick={addItem} />}>
            <Icon color='blue' name='info circle' />
            {MESSAGES.ADD_ITEM[language]}
          </Popup>
          }
        </label>
        {!uiSchema.input.multiple &&
        <CustomDatePicker displayName={uiSchema.displayName} index={-1} merge={mergeShallowChange} outline={outline}
                          value={value} />
        }
        {uiSchema.input.multiple && value.map((entry, index) =>
          <Fragment key={index}>
            <CustomDatePicker displayName={uiSchema.displayName} index={index} merge={mergeDeepChange} outline={outline}
                              value={entry} />
            <Popup basic flowing
                   trigger={<Icon link name='delete' color='red' onClick={removeItem.bind(this, index)}
                                  onMouseOut={hideOutlines} onMouseOver={showOutline.bind(this, index)} />}>
              <Icon color='blue' name='info circle' />
              {MESSAGES.REMOVE_ITEM[language]}
            </Popup>
            <Divider hidden style={{ marginBottom: 0 }} />
          </Fragment>
        )}
      </Form.Field>
    )
  }
}

class CustomDatePicker extends Component {
  convertDate = (date) => {
    if (date !== null && typeof date === 'string') {
      return new Date(date)
    } else {
      return date
    }
  }

  render () {
    const { displayName, index, merge, outline, value } = this.props

    let language = this.context.value

    return <DatePicker todayButton={UI.TODAY[language]} dateFormat={UI.DATE_FORMAT[language]} showWeekNumbers
                       peekNextMonth showMonthDropdown showYearDropdown dropdownMode='select' locale={language}
                       customInput={<CustomDateInput index={index} outline={outline} />}
                       placeholderText={truncateString(displayName)} selected={this.convertDate(value)}
                       onChange={date => merge(index, date)} />
  }
}

class CustomDateInput extends Component {
  render () {
    const { index, onClick, outline, value } = this.props

    return <Input style={outline === index ? style : {}} icon={{ name: 'calendar alternate outline', color: 'teal' }}
                  iconPosition='left' value={value} onClick={onClick} />
  }
}

CustomDatePicker.contextType = LanguageContext
FIDateView.contextType = LanguageContext

export default FIDateView
