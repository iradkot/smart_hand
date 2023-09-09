// renderer/src/components/CopyHistory.tsx

import React from 'react'
import styled from 'styled-components'
import { useCopyHistory } from '../contexts/CopyHistoryContext'

const Container = styled.div`
  margin-top: 20px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
`

const HistoryItem = styled.li`
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`

function CopyHistory() {
  const { history } = useCopyHistory()

  const handleItemClick = (content: string) => {
    alert('Content has been copied') // Display content in an alert
    navigator.clipboard
      .writeText(content) // Copy content to clipboard
      .then(() => {
        console.log('Content copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy content: ', err)
      })
  }

  return (
    <Container>
      <h2>Copy History</h2>
      <ul>
        {history.map((item, index) => (
          <HistoryItem key={index} onClick={() => handleItemClick(item.content)}>
            <strong>Path:</strong> {item.path}
            <br />
            <strong>Timestamp:</strong> {new Date(item.timestamp).toLocaleString()}
          </HistoryItem>
        ))}
      </ul>
    </Container>
  )
}

export default CopyHistory
