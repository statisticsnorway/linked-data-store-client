import { API } from './API'

export const BASE_TEST_URL = 'http://localhost:9090'

export const LDS_TEST_PROPERTIES = {
  namespace: API.DEFAULT_NAMESPACE,
  producer: API.DEFAULT_PRODUCER,
  url: BASE_TEST_URL,
  user: 'Test user'
}

export const TEST_DOMAINS = {
  AGENT: 'Agent',
  PROCESS_STEP: 'ProcessStep',
  PROCESS_STEP_INSTANCE: 'ProcessStepInstance',
  STATISTICAL_PROGRAM: 'StatisticalProgram'
}

export const TEST_URLS = {
  BASE_SCHEMAS_URL: `${BASE_TEST_URL}/${LDS_TEST_PROPERTIES.namespace}${API.SCHEMA_QUERY}`,
  AGENT_BASE_URL: `${BASE_TEST_URL}/${LDS_TEST_PROPERTIES.namespace}/${TEST_DOMAINS.AGENT}`,
  AGENT_SCHEMA_URL: `${BASE_TEST_URL}/${LDS_TEST_PROPERTIES.namespace}/${TEST_DOMAINS.AGENT}${API.SCHEMA_QUERY}`,
  STATISTICAL_PROGRAM_SCHEMA_URL: `${BASE_TEST_URL}/${LDS_TEST_PROPERTIES.namespace}/${TEST_DOMAINS.STATISTICAL_PROGRAM}${API.SCHEMA_QUERY}`
}
