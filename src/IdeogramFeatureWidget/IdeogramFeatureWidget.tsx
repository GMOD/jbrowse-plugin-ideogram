import React from 'react'

import {
  BaseCard,
  FeatureDetails,
} from '@jbrowse/core/BaseFeatureWidget/BaseFeatureDetail'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import {
  Button,
  Chip,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { observer } from 'mobx-react'
import { makeStyles } from 'tss-react/mui'

import { navToAnnotation, openReactomeView } from '../util'


const useStyles = makeStyles()(() => ({
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
  const { classes } = useStyles()
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
  const { classes } = useStyles()
  const { feature } = props

  const externalLinkArray = feature.externalLinks

  return (
    <BaseCard title="External Links">
      <div className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableBody>
            {externalLinkArray.map(
              (externalLink: { name: string; link: string }, key: number) => (
                <ExternalLink
                  id={feature.geneSymbol ? feature.geneSymbol : feature.name}
                  {...externalLink}
                  key={key}
                />
              ),
            )}
          </TableBody>
        </Table>
      </div>
    </BaseCard>
  )
}

function Synonyms(props: any) {
  const { classes } = useStyles()
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
            void navToAnnotation(`${feature.genomeLocation}`, model)
          }}
        >
          Navigate
        </Button>
      </div>
    </BaseCard>
  )
}

function ReactomeItem(props: any) {
  const { node, model, pathways, geneName } = props
  const { classes } = useStyles()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Link
        className={classes.link}
        target="_blank"
        rel="noopener"
        href={`https://reactome.org/PathwayBrowser/#/${node.stId}&FLG=${node.name}`}
        underline="always"
      >
        {node.name}
      </Link>
      {model.hasPlugin('ReactomePlugin') ? (
        <Tooltip title="Open pathway in Reactome Plugin">
          <IconButton
            color="primary"
            component="span"
            onClick={() => {
              void openReactomeView(
                node.stId,
                pathways,
                node.name,
                geneName,
                model,
              )
            }}
          >
            <MenuOpenIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </div>
  )
}

function Hierarchy(props: any) {
  const { hierarchy, model, pathways, geneName } = props

  const renderTree = (nodes: any) => (
    <TreeItem
      key={nodes.stId}
      itemId={nodes.stId}
      label={
        <ReactomeItem
          node={nodes}
          model={model}
          pathways={pathways}
          geneName={geneName}
        />
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node: any) => renderTree(node))
        : null}
    </TreeItem>
  )

  return (
    <BaseCard title="Reactome Annotated Pathways">
      <SimpleTreeView
        slots={{ collapseIcon: ExpandMoreIcon, expandIcon: ChevronRightIcon }}
      >
        {hierarchy.map((node: any) => renderTree(node))}
      </SimpleTreeView>
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
        omit={[
          'synonyms',
          'externalLinks',
          'pathways',
          'reactomeIds',
          'hierarchy',
        ]}
      />
      <NavLink feature={fullFeature} model={model}></NavLink>
      {fullFeature.externalLinks && <ExternalLinks feature={fullFeature} />}
      {fullFeature.synonyms && <Synonyms feature={fullFeature} />}
      {fullFeature.hierarchy?.length > 0 && (
        <Hierarchy
          hierarchy={fullFeature.hierarchy}
          model={model}
          pathways={fullFeature.pathways}
          geneName={fullFeature.name}
        />
      )}
    </Paper>
  )
}

export default observer(IdeoFeatureDetails)
