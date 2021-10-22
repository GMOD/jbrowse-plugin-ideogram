import { AlignHorizontalLeftIcon, MaleIcon } from './Icons'
import { types, Instance } from 'mobx-state-tree'
import { ElementId } from '@jbrowse/core/util/types/mst'
import { MenuItem } from '@jbrowse/core/ui'
import PluginManager from '@jbrowse/core/PluginManager'

export default function IdeogramView(pluginManager: PluginManager) {
  return types
    .model('IdeogramView', {
      type: types.literal('IdeogramView'),
      displayName: types.maybe(types.string),
      id: ElementId,
      sex: 'female',
      orientation: 'vertical',
      pliody: 2,
    })
    .actions(self => ({
      setWidth(n: number) {
        /* do nothing */
      },
      setDisplayName(str: string) {
        self.displayName = str
      },
      toggleOrientation() {
        if (self.orientation === 'horizontal') {
          self.orientation = 'vertical'
          self.pliody = 2
        } else {
          self.orientation = 'horizontal'
          self.pliody = 1
        }
      },
      toggleSex() {
        if (self.sex === 'male') {
          self.sex = 'female'
        } else {
          self.sex = 'male'
        }
      },
    }))
    .views(self => ({
      menuItems(): MenuItem[] {
        const menuItems: MenuItem[] = [
          {
            label: 'Horizontal Display',
            icon: AlignHorizontalLeftIcon,
            type: 'checkbox',
            checked: self.orientation === 'horizontal',
            onClick: () => self.toggleOrientation(),
          },
          {
            label: 'Male Genome',
            icon: MaleIcon,
            type: 'checkbox',
            checked: self.sex === 'male',
            onClick: () => self.toggleSex(),
          },
        ]
        return menuItems
      },
    }))
}

export type IdeogramViewStateModel = ReturnType<typeof IdeogramView>
export type IdeogramViewModel = Instance<IdeogramViewStateModel>
