import React, { useEffect, useRef, useMemo } from 'react'
import { observer } from 'mobx-react'
import Ideogram from 'ideogram'
import ImportForm from './ImportForm'
import { allChromosomes, cosmicLegend } from './util'
import { Grid } from '@material-ui/core'
import { getSession } from '@jbrowse/core/util'

let iter = 0
const IdeogramView = observer(({ model }: { model: any }) => {
  const ref = useRef<HTMLDivElement>(null)
  const identifier = useMemo(() => {
    iter++
    return 'ideo-container-' + iter
  }, [])

  const chromosomes = model.allRegions ? allChromosomes : [model.region]
  const chrHeight =
    model.allRegions || model.orientation === 'vertical' ? 300 : 900
  const chrWidth = model.allRegions && model.orientation === 'vertical' ? 8 : 10
  const showBandLabels = !model.allRegions
  const annotations =
    model.ideoAnnotations && model.showAnnotations
      ? model.ideoAnnotations
      : undefined

  const legend = model.ideoAnnotations ? cosmicLegend : undefined

  function onClickAnnot(annot: any) {
    const session = getSession(model)
    const target = model.widgetAnnotations.filter(function(data: any) {
      return data.name == annot.name
    })[0]

    if (session) {
      // @ts-ignore
      const widget = session.addWidget(
        'IdeogramFeatureWidget',
        'ideogramFeature',
        {
          featureData: target,
        },
      )
      // @ts-ignore
      session.showWidget(widget)
      session.setSelection(target)
    }
  }

  var config = {
    organism: 'human',
    sex: model.sex,
    chrHeight,
    chrWidth,
    chromosomes,
    showBandLabels,
    rotatable: false,
    orientation: model.orientation,
    container: '#' + identifier,
    annotations,
    legend,
    onClickAnnot,
  }

  useEffect(() => {
    if (ref.current) {
      return new Ideogram(config)
    }
  }, [
    model.sex,
    model.orientation,
    model.pliody,
    model.showImportForm,
    model.allRegions,
    model.region,
    model.showAnnotations,
  ])

  return (
    <div>
      {model.showImportForm ? <ImportForm model={model} /> : null}
      {!model.showImportForm && model.orientation === 'horizontal' ? (
        <Grid container spacing={1} justifyContent="center" alignItems="center">
          <div ref={ref} id={identifier}></div>
        </Grid>
      ) : null}
      {!model.showImportForm && model.orientation === 'vertical' ? (
        <div ref={ref} id={identifier} style={{ paddingTop: '5px' }}></div>
      ) : null}
    </div>
  )
})

export default IdeogramView
