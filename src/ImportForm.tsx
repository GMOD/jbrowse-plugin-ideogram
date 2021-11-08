import React, { useState } from 'react'
import { observer } from 'mobx-react'
import AssemblySelector from '@jbrowse/core/ui/AssemblySelector'
import { FileSelector } from '@jbrowse/core/ui'
import { getSession } from '@jbrowse/core/util'
import {
  Button,
  Container,
  Grid,
  TextField,
  MenuItem,
  Divider,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
} from '@material-ui/core'
import { regions } from './util'
import CloseIcon from '@material-ui/icons/Close'

import { generateAnnotations } from './AnnotationsAdapter'

const useStyles = makeStyles(theme => ({
  importFormContainer: {
    padding: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(2),
  },
  importFormEntry: {
    minWidth: 180,
  },
  closeButton: {
    position: 'absolute',
    right: '4px',
    top: '4px',
  },
}))

const RegionSelector = observer(
  ({
    onChange,
    selected,
  }: {
    onChange: (arg: string) => void
    selected: string | undefined
  }) => {
    const classes = useStyles()
    const error = regions.length ? '' : 'No configured regions'
    return (
      <TextField
        select
        label="Region"
        variant="outlined"
        margin="normal"
        helperText={error || 'Select a region to view'}
        value={error ? '' : selected}
        inputProps={{ 'data-testid': 'region-selector' }}
        onChange={event => onChange(event.target.value)}
        error={!!error}
        disabled={!!error}
        className={classes.importFormEntry}
      >
        {regions.map(name => {
          return (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          )
        })}
      </TextField>
    )
  },
)

/**
 * Most layout and logic retrieved from the '@jbrowse/plugin/linear-genome-view/../ImportForm.tsx' component and modified for
 * the purposes of this component
 */
const ImportForm = observer(({ model }: { model: any }) => {
  const classes = useStyles()
  const session = getSession(model)
  const { assemblyNames } = session
  const [selectedAsm, setSelectedAsm] = useState(assemblyNames[0])
  const [selectedRegion, setSelectedRegion] = useState(regions[0])

  async function populateAnnotations() {
    if (model.annotationsLocation) {
      const { widget, ideo, res } = await generateAnnotations(
        model.annotationsLocation,
      )

      if (res.type != 2) {
        model.setWidgetAnnotations(widget)
        model.setIdeoAnnotations(ideo)
      }

      if (!res.success) {
        session.queueDialog((doneCallback: Function) => [
          ErrorDialogue,
          {
            res,
            handleClose: () => {
              doneCallback()
            },
          },
        ])
      }
    }
  }

  async function handleOpen(assembly: string, region: string) {
    model.setAssembly(assembly)
    model.setRegion(region)
    model.setOrientation('horizontal')
    model.setAllRegions(false)
    await populateAnnotations()
    model.setShowImportForm(false)
  }

  async function handleOpenAllRegions(assembly: string) {
    model.setAllRegions(true)
    model.setAssembly(assembly)
    await populateAnnotations()
    model.setShowImportForm(false)
  }

  return (
    <div>
      <Container className={classes.importFormContainer}>
        <Grid container spacing={1} justifyContent="center" alignItems="center">
          <Grid item>
            <AssemblySelector
              onChange={val => {
                setSelectedAsm(val)
              }}
              session={session}
              selected={selectedAsm}
            />
          </Grid>
          <Grid item>
            <RegionSelector
              onChange={val => {
                setSelectedRegion(val)
              }}
              selected={selectedRegion}
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              disabled={!selectedRegion}
              className={classes.button}
              onClick={() => {
                if (selectedRegion) {
                  handleOpen(selectedAsm, selectedRegion)
                }
              }}
              variant="contained"
              color="primary"
            >
              Open
            </Button>
            <Button
              disabled={!selectedRegion}
              className={classes.button}
              onClick={() => {
                handleOpenAllRegions(selectedAsm)
              }}
              variant="contained"
              color="secondary"
            >
              Show all regions in assembly
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Divider></Divider>
      <Container className={classes.importFormContainer}>
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Typography variant="body2">
            <b>Optional:</b> provide a .tsv file of gene annotations for the
            ideogram.
          </Typography>
          <Grid item>
            <FileSelector
              name="Annotations file"
              location={model.annotationsLocation}
              setLocation={loc => model.setAnnotationsLocation(loc)}
            ></FileSelector>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
})

function ErrorDialogue({
  res,
  handleClose,
}: {
  res: any
  handleClose: () => void
}) {
  const classes = useStyles()

  return (
    <Dialog open onClose={handleClose} maxWidth="sm">
      <DialogTitle>
        There are some problems with your annotations file
        <IconButton
          className={classes.closeButton}
          onClick={() => handleClose()}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">{res.message}</Typography>
      </DialogContent>
    </Dialog>
  )
}

export default ImportForm
