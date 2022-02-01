import React from 'react'
import { observer } from 'mobx-react'
import {
  FeatureDetails,
  BaseCard,
} from '@jbrowse/core/BaseFeatureWidget/BaseFeatureDetail'
import {
  Paper,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Link,
  Chip,
  Button,
  makeStyles,
} from '@material-ui/core'
import { navToAnnotation } from '../util'

const useStyles = makeStyles(() => ({
  table: {
    padding: 0,
  },
  link: {
    color: 'rgb(0, 0, 238)',
  },
  tableContainer: {
    width: '100%',
    maxHeight: 600,
    overflow: 'auto',
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
      <div className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableBody>
            {externalLinkArray.map((externalLink: string, key: string) => (
              <ExternalLink
                id={feature.geneSymbol ? feature.geneSymbol : feature.name}
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
      <div className={classes.tableContainer}>
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

function NavLink(props: any) {
  const { feature, model } = props

  return (
    <BaseCard title="Navigate to feature on linear genome view">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            navToAnnotation(`${feature.genomeLocation}`, model)
          }}
        >
          Navigate
        </Button>
      </div>
    </BaseCard>
  )
}

function Pathways(props: any) {
  const classes = useStyles()
  const { feature } = props

  let pathways = feature.pathways

  pathways = pathways
    .slice()
    .sort(
      (a: any, b: any) =>
        parseFloat(a.entities.pValue) - parseFloat(b.entities.pValue),
    )

  const headers = [
    'Pathway name',
    'Entities found',
    'Entities Total',
    'Entities ratio',
    'Entities pValue',
    'Entities FDR',
    'Reactions found',
    'Reactions total',
    'Reactions ratio',
  ]

  return (
    <BaseCard title="Pathways">
      <div className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {headers.map((header: string, index: number) => (
                <TableCell key={`${index}-${header}`}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pathways.map((pathway: any, key: string) => (
              <TableRow key={key}>
                <TableCell>
                  <Link
                    target="_blank"
                    rel="noopener"
                    underline="always"
                    href={`https://reactome.org/content/detail/${pathway.stId}`}
                  >
                    {pathway.name}
                  </Link>
                </TableCell>
                <TableCell align="right">{pathway.entities.found}</TableCell>
                <TableCell align="right">{pathway.entities.total}</TableCell>
                <TableCell align="right">
                  {pathway.entities.ratio.toExponential(2)}
                </TableCell>
                <TableCell align="right">
                  {pathway.entities.pValue.toExponential(2)}
                </TableCell>
                <TableCell align="right">
                  {pathway.entities.fdr.toExponential(2)}
                </TableCell>
                <TableCell align="right">{pathway.reactions.found}</TableCell>
                <TableCell align="right">{pathway.reactions.total}</TableCell>
                <TableCell align="right">
                  {pathway.reactions.ratio.toFixed(3)}
                </TableCell>
              </TableRow>
            ))}
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
        omit={['synonyms', 'externalLinks', 'pathways', 'reactomeIds']}
      />
      <NavLink feature={fullFeature} model={model}></NavLink>
      {fullFeature.externalLinks && <ExternalLinks feature={fullFeature} />}
      {fullFeature.synonyms && <Synonyms feature={fullFeature} />}
      {fullFeature.pathways &&
        !fullFeature.pathways.includes(undefined) &&
        fullFeature.pathways.length > 0 && <Pathways feature={fullFeature} />}
    </Paper>
  )
}

export default observer(IdeoFeatureDetails)
