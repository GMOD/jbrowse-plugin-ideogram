import { types, Instance } from 'mobx-state-tree'
import VisibilityIcon from '@material-ui/icons/Visibility'
import { ElementId } from '@jbrowse/core/util/types/mst'
import { MenuItem } from '@jbrowse/core/ui'
import PluginManager from '@jbrowse/core/PluginManager'
import { AlignHorizontalLeftIcon, HourglassIcon, MaleIcon } from './Icons'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import { FileLocation } from '@jbrowse/core/util/types'

export default function IdeogramView(pluginManager: PluginManager) {
  return types
    .model('IdeogramView', {
      type: types.literal('IdeogramView'),
      displayName: types.maybe(types.string),
      id: ElementId,

      // ideogram config
      sex: 'female',
      orientation: 'vertical',
      region: '1',
      assembly: 'hg38',

      // display options
      allRegions: false,
      showImportForm: true,
      showAnnotations: true,
      withReactome: false,
      showLoading: false,
    })
    .volatile(() => ({
      annotationsLocation: (undefined as unknown) as FileLocation,
      widgetAnnotations: (undefined as unknown) as object,
      ideoAnnotations: (undefined as unknown) as object,
    }))
    .actions(self => ({
      setWidth(n: number) {
        /* do nothing */
      },
      setDisplayName(str: string) {
        self.displayName = str
      },
      setRegion(chr: string) {
        self.region = chr.split('chr')[1]
      },
      setAssembly(asm: string) {
        self.assembly = asm
      },
      setAllRegions(toggle: boolean) {
        self.allRegions = toggle
      },
      setOrientation(ori: string) {
        if (ori === 'horizontal') {
          self.orientation = ori
        }
        if (ori === 'vertical') {
          self.orientation = ori
        }
      },
      setShowImportForm(toggle: boolean) {
        self.showImportForm = toggle
      },
      setAnnotationsLocation(loc: FileLocation) {
        self.annotationsLocation = loc
      },
      setWidgetAnnotations(obj: object) {
        self.widgetAnnotations = obj
      },
      setIdeoAnnotations(obj: object) {
        self.ideoAnnotations = obj
      },
      setWithReactome(toggle: boolean) {
        self.withReactome = toggle
      },
      setShowLoading(toggle: boolean) {
        self.showLoading = toggle
      },
      toggleAllRegions(toggle: boolean) {
        if (toggle === false) {
          this.setOrientation('horizontal')
        }
        this.setAllRegions(toggle)
      },
      toggleOrientation() {
        if (self.orientation === 'horizontal') {
          this.setOrientation('vertical')
        } else {
          this.setOrientation('horizontal')
        }
      },
      toggleSex() {
        if (self.sex === 'male') {
          self.sex = 'female'
        } else {
          self.sex = 'male'
        }
      },
      toggleAnnotations() {
        self.showAnnotations = !self.showAnnotations
      },
    }))
    .views(self => ({
      menuItems(): MenuItem[] {
        const menuItems: MenuItem[] = [
          {
            label: 'Return to import form',
            icon: FolderOpenIcon,
            onClick: () => self.setShowImportForm(true),
          },
          {
            label: 'Show all regions in assembly',
            icon: VisibilityIcon,
            type: 'checkbox',
            checked: self.allRegions === true,
            onClick: () => self.toggleAllRegions(!self.allRegions),
          },
          {
            label: 'Horizontal Display',
            icon: AlignHorizontalLeftIcon,
            type: 'checkbox',
            disabled: self.allRegions === false,
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
          {
            label: 'Show annotations',
            icon: HourglassIcon,
            type: 'checkbox',
            checked: self.showAnnotations === true,
            disabled: self.widgetAnnotations === undefined,
            onClick: () => self.toggleAnnotations(),
          },
        ]
        return menuItems
      },
    }))
}

export type IdeogramViewStateModel = ReturnType<typeof IdeogramView>
export type IdeogramViewModel = Instance<IdeogramViewStateModel>
