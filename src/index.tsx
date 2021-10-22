import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import { version } from '../package.json'
import { AbstractSessionModel, isAbstractMenuManager } from '@jbrowse/core/util'
import ViewType from '@jbrowse/core/pluggableElementTypes/ViewType'
import PauseIcon from '@material-ui/icons/Pause'
import IdeogramView from './IdeogramView'
import stateModelFactory from './model'

export default class IdeogramPlugin extends Plugin {
  name = 'IdeogramPlugin'
  version = version

  install(pluginManager: PluginManager) {
    pluginManager.addViewType(
      () =>
        new ViewType({
          name: 'IdeogramView',
          stateModel: stateModelFactory(pluginManager),
          ReactComponent: IdeogramView,
        }),
    )
  }

  configure(pluginManager: PluginManager) {
    if (isAbstractMenuManager(pluginManager.rootModel)) {
      pluginManager.rootModel.appendToSubMenu(['Add'], {
        label: 'Ideogram view',
        icon: PauseIcon,
        onClick: (session: AbstractSessionModel) => {
          session.addView('IdeogramView', {})
          const xView = session.views.length - 1
          // @ts-ignore
          session.views[xView].setDisplayName('Ideogram View')
        },
      })
    }
  }
}
