export const QUERIES = {
  StatisticalProgram: `
    query getStatisticalProgramById($id: ID!) {
      StatisticalProgramById(id: $id) {
        statisticalProgramCycles {
          edges {
            node {
              id
              name {languageText}
              description {languageText}
              businessProcesses {
                edges {
                  node {
                    id
                    name {languageText}
                    description {languageText}
                    parentBusinessProcess {id}
                    reverseBusinessProcessParentBusinessProcess {
                      edges {
                        node {
                          id
                          name {languageText}
                          description {languageText}
                          previousBusinessProcess {id}
                          processSteps {
                            edges {
                              node {
                                id
                                name {languageText}
                                technicalPackageID
                                codeBlocks {
                                  codeBlockIndex
                                  codeBlockTitle
                                  codeBlockType
                                  codeBlockValue
                                  processStepInstance {
                                    id
                                    transformableInputs {
                                      edges {
                                        node {
                                          inputId {
                                            ... on UnitDataSet {
                                              id
                                              name {languageText}
                                              description {languageText}
                                            }
                                          }
                                        }
                                      }
                                    }
                                    processExecutionCode
                                    processExecutionLog {logMessage}
                                    transformedOutputs {
                                      edges {
                                        node {
                                          outputId {
                                            ... on UnitDataSet {
                                              id
                                              name {languageText}
                                              description {languageText}
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    previousBusinessProcess {
                      id
                      name {languageText}
                      description {languageText}
                    }
                    processSteps {
                      edges {
                        node {
                          id
                          name {languageText}
                          description {languageText}
                          technicalPackageID
                          codeBlocks {
                            codeBlockIndex
                            codeBlockTitle
                            codeBlockType
                            codeBlockValue
                            processStepInstance {
                              id
                              transformableInputs {
                                edges {
                                  node {
                                    inputId {
                                      ... on UnitDataSet {
                                        id
                                        name {languageText}
                                        description {languageText}
                                      }
                                    }
                                  }
                                }
                              }
                              processExecutionCode
                              processExecutionLog {logMessage}
                              transformedOutputs {
                                edges {
                                  node {
                                    outputId {
                                      ... on UnitDataSet {
                                        id
                                        name {languageText}
                                        description {languageText}
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `
}
