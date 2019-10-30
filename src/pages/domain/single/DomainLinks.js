import React, { useContext, useEffect } from 'react'
import { Divider, Message, Segment } from 'semantic-ui-react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-github'

import { LanguageContext } from '../../../utilities/context/LanguageContext'
import { API, ERRORS, UI } from '../../../enum'
import { GraphqlFetchById } from '../../../utilities/fetch/GraphQL'

function DomainLinks ({ domain, id, url }) {
  const language = useContext(LanguageContext).value
  const [{ data, loading, info, error }, doFetch] = GraphqlFetchById(domain, id, url)

  useEffect(() => doFetch(true))

  return (
    <Segment basic loading={loading} data-testid='queryInfo'>
      <Divider />
      {!loading && error && <Message negative icon='warning' header={ERRORS.ERROR[language]} content={error} />}
      {!loading && !error &&
      <AceEditor
        mode='json'
        theme='github'
        fontSize={16}
        highlightActiveLine={true}
        readOnly={true}
        placeholder={UI.QUERY_RESPONSE[language]}
        value={JSON.stringify(data, null, 2)}
        width='100%'
        editorProps={{ $blockScrolling: true }}
      />
      }
      <a href={`${url}/${API.GRAPHIQL}`}>{UI.GRAPHIQL[language]}</a>
      {!loading && info && info.map((info, index) =>
        <Message key={index} info icon='info' header={UI.INFO[language]} content={info.message} />
      )}
    </Segment>
  )
}

export default DomainLinks
