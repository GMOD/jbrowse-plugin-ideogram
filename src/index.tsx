import React from 'react'
import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import { version } from '../package.json'
import { AbstractSessionModel, isAbstractMenuManager } from '@jbrowse/core/util'
import ViewType from '@jbrowse/core/pluggableElementTypes/ViewType'
import PauseIcon from '@material-ui/icons/Pause'

function Ideogram(props: any) {
  return <div>Hello world</div>
}

export default class IdeogramPlugin extends Plugin {
  name = 'IdeogramPlugin'
  version = version

  install(pluginManager: PluginManager) {
    pluginManager.addViewType(
      () =>
        new ViewType({
          name: 'Ideogram',
          //@ts-ignore
          stateModel: MSAModel,
          ReactComponent: Ideogram,
        }),
    )
  }

  configure(pluginManager: PluginManager) {
    if (isAbstractMenuManager(pluginManager.rootModel)) {
      pluginManager.rootModel.appendToSubMenu(['File', 'Add'], {
        label: 'Ideogram view',
        icon: PauseIcon,
        onClick: (session: AbstractSessionModel) => {
          session.addView('Ideogram', {})
        },
      })
    }
  }
}
