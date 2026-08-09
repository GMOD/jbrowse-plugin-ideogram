import Plugin from '@jbrowse/core/Plugin'
import ViewType from '@jbrowse/core/pluggableElementTypes/ViewType'
import WidgetType from '@jbrowse/core/pluggableElementTypes/WidgetType'
import { isAbstractMenuManager } from '@jbrowse/core/util'
import PauseIcon from '@mui/icons-material/Pause'

import { version } from '../package.json'
import IdeogramFeatureWidgetF from './IdeogramFeatureWidget'
import IdeogramView from './IdeogramView'
import stateModelFactory from './model'

import type PluginManager from '@jbrowse/core/PluginManager'
import type { SessionWithWidgets} from '@jbrowse/core/util'

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

    pluginManager.addWidgetType(() => {
      return new WidgetType({
        name: 'IdeogramFeatureWidget',
        heading: 'Feature Details',
        ...IdeogramFeatureWidgetF(pluginManager),
      })
    })
  }

  configure(pluginManager: PluginManager) {
    if (isAbstractMenuManager(pluginManager.rootModel)) {
      pluginManager.rootModel.appendToSubMenu(['Add'], {
        label: 'Ideogram view',
        icon: PauseIcon,
        onClick: (session: SessionWithWidgets) => {
          // addView returns the view it made, so there is no need to reach back
          // into session.views by index and no need for a ts-ignore
          session.addView('IdeogramView', {}).setDisplayName('Ideogram View')
        },
      })
    }
  }
}
