import React from 'react'
import styled from 'styled-components'
import { Grid, Container as MuiContainer } from '@material-ui/core'
import SideMenu from '../../components/ui/SideMenu'
import MainMenu from '../../components/layout/SmartFlow'
import { useCopyToClipboard } from './contexts/CopyToClipboardContext' // Adju  st the path accordingly!

// import * from '../../utils/errorHandling';

const Container = styled(MuiContainer)`
  padding: 20px;
`

function App() {
  const { currentStepId } = useCopyToClipboard()
  console.log({ currentStepId })
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>Smart hand</h1>
        </Grid>
        <Grid item xs={10}>
          <MainMenu />
        </Grid>
        {currentStepId === 4 && (
          <Grid item xs={2}>
            <SideMenu />
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default App
