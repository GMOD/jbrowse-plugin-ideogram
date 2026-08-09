import { getSession } from '@jbrowse/core/util'
import { ElementId } from '@jbrowse/core/util/types/mst'
import { types } from '@jbrowse/mobx-state-tree'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import TableChartIcon from '@mui/icons-material/TableChart'
import VisibilityIcon from '@mui/icons-material/Visibility'

import { AlignHorizontalLeftIcon, HourglassIcon, MaleIcon } from './Icons'

import type PluginManager from '@jbrowse/core/PluginManager'
import type { MenuItem } from '@jbrowse/core/ui'
import type { FileLocation } from '@jbrowse/core/util/types'
import type { Instance } from '@jbrowse/mobx-state-tree'

export default function IdeogramView(_pluginManager: PluginManager) {
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
      selectedAnnot: '',
      ideogramId: '',

      // display options
      allRegions: false,
      showImportForm: true,
      showAnnotations: true,
      withReactome: false,
      showLoading: false,
      isAnalysisResults: false,

      annotationsLocation: types.optional(types.frozen(), {
        uri: '',
        locationType: 'UriLocation',
      }),
    })
    // These start out undefined and the code below already checks for that, so
    // say so in the type. The `undefined as unknown as object` double-cast that
    // used to be here asserted the opposite, which made every one of those
    // checks look impossible to the compiler while doing nothing at runtime.
    .volatile(() => ({
      widgetAnnotations: undefined as object | undefined,
      ideoAnnotations: undefined as object | undefined,
      pathways: undefined as object | undefined,
      highlightedAnnots: undefined as object[] | undefined,
    }))
    .actions(self => ({
      setWidth(_n: number) {
        /* do nothing */
      },
      setDisplayName(str: string) {
        self.displayName = str
      },
      setRegion(chr: string) {
        self.region = chr.split('chr')[1] ?? chr
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
      setWidgetAnnotations(obj: any) {
        self.widgetAnnotations = obj
      },
      setIdeoAnnotations(obj: any) {
        self.ideoAnnotations = obj
      },
      setWithReactome(toggle: boolean) {
        self.withReactome = toggle
      },
      setShowLoading(toggle: boolean) {
        self.showLoading = toggle
      },
      setPathways(obj: any) {
        self.pathways = obj
      },
      setIsAnalysisResults(toggle: boolean) {
        self.isAnalysisResults = toggle
      },
      setSelectedAnnot(item: string) {
        self.selectedAnnot = item
        this.applyHighlighting()
      },
      setHighlightedAnnots(arr: any) {
        self.highlightedAnnots = arr
        this.applyHighlighting()
      },
      setIdeogramId(id: string) {
        self.ideogramId = id
      },
      applyHighlighting() {
        // @ts-ignore
        self.ideoAnnotations.filter((annot: any) => {
          if (self.highlightedAnnots?.includes(annot.name)) {
            annot.color = '#FFC20A'
          }
          if (self.selectedAnnot === annot.name) {
            annot.color = '#000000'
          }
          if (
            !self.highlightedAnnots?.includes(annot.name) &&
            self.selectedAnnot !== annot.name
          ) {
            annot.color = annot.prevColor
          }
        })
      },
      toggleAllRegions(toggle: boolean) {
        if (!toggle) {
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
      refreshTable() {
        const session = getSession(self)
        const isActive = session.views.some(
          (view: any) => view?.isAnalysisResults,
        )
        if (!isActive) {
          session.addView('IdeogramView', {})
          const xView = session.views.length - 1
          // @ts-ignore
          session.views[xView].setDisplayName('Reactome Analysis Results')
          // @ts-ignore
          session.views[xView].setPathways(self.pathways)
          // @ts-ignore
          session.views[xView].setIsAnalysisResults(true)
          // @ts-ignore
          session.views[xView].setIdeogramId(self.ideogramId)
        } else {
          session.notify(
            'The analysis results table is already displayed.',
            'info',
          )
        }
      },
    }))
    .views(self => ({
      menuItems(): MenuItem[] {
        const menuItems: MenuItem[] = [
          {
            label: 'Return to import form',
            icon: FolderOpenIcon,
            disabled: self.isAnalysisResults,
            onClick: () => { self.setShowImportForm(true) },
          },
          {
            label: 'Show all regions in assembly',
            icon: VisibilityIcon,
            type: 'checkbox',
            checked: self.allRegions,
            disabled:
              self.isAnalysisResults || self.showImportForm,
            onClick: () => { self.toggleAllRegions(!self.allRegions) },
          },
          {
            label: 'Horizontal Display',
            icon: AlignHorizontalLeftIcon,
            type: 'checkbox',
            disabled:
              (!self.allRegions && self.isAnalysisResults) ||
              self.showImportForm,
            checked: self.orientation === 'horizontal',
            onClick: () => { self.toggleOrientation() },
          },
          {
            label: 'Male Genome',
            icon: MaleIcon,
            type: 'checkbox',
            checked: self.sex === 'male',
            disabled:
              self.isAnalysisResults || self.showImportForm,
            onClick: () => { self.toggleSex() },
          },
          {
            label: 'Show annotations',
            icon: HourglassIcon,
            type: 'checkbox',
            checked:
              self.showAnnotations &&
              self.ideoAnnotations !== undefined,
            disabled:
              (self.widgetAnnotations === undefined &&
                self.isAnalysisResults) ||
              self.showImportForm ||
              self.ideoAnnotations === undefined,
            onClick: () => { self.toggleAnnotations() },
          },
          {
            label: 'Refresh Analysis Results Table',
            icon: TableChartIcon,
            disabled:
              self.isAnalysisResults ||
              self.showImportForm ||
              !self.withReactome,
            onClick: () => { self.refreshTable() },
          },
        ]
        return menuItems
      },
    }))
}

export type IdeogramViewStateModel = ReturnType<typeof IdeogramView>
export type IdeogramViewModel = Instance<IdeogramViewStateModel>
