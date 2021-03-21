import React, { useEffect, useRef, useMemo } from 'react'
import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import { version } from '../package.json'
import { AbstractSessionModel, isAbstractMenuManager } from '@jbrowse/core/util'
import ViewType from '@jbrowse/core/pluggableElementTypes/ViewType'
import PauseIcon from '@material-ui/icons/Pause'
import { types } from 'mobx-state-tree'
import { ElementId } from '@jbrowse/core/util/types/mst'

import Ideogram from 'ideogram'

let iter = 0
function IdeogramView(props: any) {
  const ref = useRef<HTMLDivElement>(null)
  const identifier = useMemo(() => {
    iter++
    return 'ideo-container-' + iter
  }, [])

  var config = {
    organism: 'human',
    sex: 'female',
    chrHeight: 300,
    chrWidth: 8,
    ploidy: 2,
    rotatable: false,
    container: '#' + identifier,
  }
  useEffect(() => {
    if (ref.current) {
      new Ideogram(config)
    }
  }, [])

  return <div ref={ref} id={identifier}></div>
}

const IdeogramViewModel = types
  .model('IdeogramView', {
    type: types.literal('IdeogramView'),
    displayName: types.maybe(types.string),
    id: ElementId,
  })
  .actions(self => ({
    setWidth(n: number) {
      /* do nothing */
    },
    setDisplayName(str: string) {
      self.displayName = str
    },
  }))

export default class IdeogramPlugin extends Plugin {
  name = 'IdeogramPlugin'
  version = version

  install(pluginManager: PluginManager) {
    pluginManager.addViewType(
      () =>
        new ViewType({
          name: 'IdeogramView',
          //@ts-ignore
          stateModel: IdeogramViewModel,
          ReactComponent: IdeogramView,
        }),
    )
  }

  configure(pluginManager: PluginManager) {
    if (isAbstractMenuManager(pluginManager.rootModel)) {
      pluginManager.rootModel.appendToSubMenu(['File', 'Add'], {
        label: 'Ideogram view',
        icon: PauseIcon,
        onClick: (session: AbstractSessionModel) => {
          session.addView('IdeogramView', {})
        },
      })
    }
  }
}
