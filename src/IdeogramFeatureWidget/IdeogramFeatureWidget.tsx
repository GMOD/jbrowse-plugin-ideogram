import React from 'react'
import { observer } from 'mobx-react'
import {
  FeatureDetails,
  BaseCard,
} from '@jbrowse/core/BaseFeatureWidget/BaseFeatureDetail'
import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Link,
  Chip,
  makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles(() => ({
  table: {
    padding: 0,
  },
  link: {
    color: 'rgb(0, 0, 238)',
  },
}))

/**
 * Render a single table row for an external link
 */
const ExternalLink = observer((props: any) => {
  const classes = useStyles()
  const { id, name, link } = props
  return (
    <>
      <TableRow key={`${id}-${name}`}>
        <TableCell>{name}</TableCell>
        <TableCell>
          <Link
            className={classes.link}
            target="_blank"
            rel="noopener"
            href={`${link}`}
            underline="always"
          >
            {id}
          </Link>
        </TableCell>
      </TableRow>
    </>
  )
})

function ExternalLinks(props: any) {
  const classes = useStyles()
  const { feature } = props

  const externalLinkArray = feature.externalLinks

  return (
    <BaseCard title="External Links">
      <div style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}>
        <Table className={classes.table}>
          <TableBody>
            {externalLinkArray.map((externalLink: string, key: string) => (
              <ExternalLink
                id={feature.geneSymbol}
                {...externalLink}
                key={key}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </BaseCard>
  )
}

function Synonyms(props: any) {
  const classes = useStyles()
  const { feature } = props

  const synonyms = feature.synonyms.split(',')

  return (
    <BaseCard title="Synonyms">
      <div style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}>
        <Table className={classes.table}>
          <TableBody>
            <TableRow key={`${feature.geneId}-synonyms`}>
              <TableCell>
                {synonyms.map((synonym: string, key: string) => (
                  <Chip
                    label={synonym}
                    key={key}
                    style={{ marginRight: '2px', marginTop: '2px' }}
                  />
                ))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </BaseCard>
  )
}

function IdeoFeatureDetails(props: any) {
  const { model } = props
  const feat = model.featureData

  const fullFeature = {
    start: feat.start,
    end: feat.end,
    ...feat.details,
  }

  return (
    <Paper data-testid="ideo-widget">
      <FeatureDetails
        feature={fullFeature}
        {...props}
        omit={['synonyms', 'externalLinks']}
      />
      <Divider />
      {fullFeature.externalLinks && <ExternalLinks feature={fullFeature} />}
      <Divider />
      {fullFeature.synonyms && <Synonyms feature={fullFeature} />}
    </Paper>
  )
}

export default observer(IdeoFeatureDetails)
