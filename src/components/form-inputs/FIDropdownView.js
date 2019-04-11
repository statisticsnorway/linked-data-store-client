import React, { Component } from 'react'
import { Form, Icon, Popup, Select } from 'semantic-ui-react'

import { truncateString } from '../../utilities'
import { ERRORS, MESSAGES } from '../../enum'

class FIDropdownView extends Component {
  render () {
    const {error, languageCode, loading, options, problem, uiSchema, value, warning} = this.props
    const {handleChange, handleExternalClick, handleLabelClick, loadOptions} = this.props

    return (
      <Form.Field required={uiSchema.input.required} error={!!error}>
        <label>
          <Popup basic flowing trigger={<span>{`${uiSchema.displayName} `}</span>}>
            <Icon color='blue' name='info circle' />
            {uiSchema.description}
          </Popup>
          {uiSchema.input.multiple &&
          <Popup basic flowing trigger={<Icon name='clone outline' color='teal' />}>
            <Icon color='blue' name='info circle' />
            {MESSAGES.MULTIPLE_CHOICES[languageCode]}
          </Popup>
          }
          {uiSchema.input.links &&
          <Popup basic flowing
                 trigger={<Icon link name='refresh' loading={loading} disabled={loading} color='blue'
                                onClick={loadOptions} />}>
            <Icon color='blue' name='info circle' />
            {MESSAGES.FETCH_AGAIN[languageCode]}
          </Popup>
          }
          {!uiSchema.input.multiple && uiSchema.input.links && value !== '' &&
          <Popup basic flowing
                 trigger={<Icon link name='external' loading={loading} disabled={loading} color='teal'
                                onClick={handleExternalClick} />}>
            <Icon color='blue' name='info circle' />
            {MESSAGES.VIEW_VALUE[languageCode]}
          </Popup>
          }
          {problem && <span style={{color: ERRORS.ERROR_COLOR}}>{`${ERRORS.NOT_FETCH[languageCode]}`}</span>}
          {warning !== false && <span style={{color: ERRORS.WARNING_COLOR}}>{warning}</span>}
        </label>
        <Select name={uiSchema.name} multiple={uiSchema.input.multiple} loading={loading} clearable
                placeholder={truncateString(uiSchema.displayName)} options={options} value={value}
                onChange={handleChange} search={options.length > 8}
                noResultsMessage={[MESSAGES.NO_RESULT[languageCode]]} onLabelClick={handleLabelClick}
                icon={options.length > 8 ? {name: 'search'} : {name: 'dropdown'}} />
      </Form.Field>
    )
  }
}

export default FIDropdownView
