import { LinearGenomeViewModel } from '@jbrowse/plugin-linear-genome-view'
import { getSession, parseLocString, when } from '@jbrowse/core/util'
import { IdeogramViewModel } from './model'

export const regions = [
  'chr1',
  'chr2',
  'chr3',
  'chr4',
  'chr5',
  'chr6',
  'chr7',
  'chr8',
  'chr9',
  'chr10',
  'chr11',
  'chr12',
  'chr13',
  'chr14',
  'chr15',
  'chr16',
  'chr17',
  'chr18',
  'chr19',
  'chr20',
  'chr21',
  'chr22',
  'chrX',
  'chrY',
]

export const allChromosomes = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  'X',
  'Y',
]

export const tierLegend = [
  {
    name: 'Tier 1',
    rows: [
      { name: '', color: '#0000FF', shape: 'triangle' },
      { name: 'Tier 2', color: '#FF0000', shape: 'triangle' },
    ],
  },
]

export async function navToAnnotation(
  locString: string,
  model: IdeogramViewModel,
) {
  // @ts-ignore
  const { assembly } = model.view
  const session = getSession(model)
  const lgv = session.views.find(
    view =>
      view.type === 'LinearGenomeView' &&
      // @ts-ignore
      view.assemblyNames[0] === assembly,
  ) as any

  if (lgv) {
    lgv.navToLocString(locString)
  } else {
    const session = getSession(model)
    const { assemblyManager } = session
    console.log(assembly)
    const sessionAssembly = await assemblyManager.waitForAssembly(assembly)
    if (sessionAssembly) {
      try {
        const loc = parseLocString(locString, refName =>
          session.assemblyManager.isValidRefName(refName, assembly),
        )
        const { refName } = loc
        const { regions } = sessionAssembly
        const canonicalRefName = sessionAssembly.getCanonicalRefName(refName)

        let newDisplayedRegion
        if (regions) {
          newDisplayedRegion = regions.find(
            (region: any) => region.refName === canonicalRefName,
          )
        }

        const view = session.addView('LinearGenomeView', {
          displayName: assembly,
        }) as LinearGenomeViewModel
        await when(() => view.initialized)

        view.setDisplayedRegions([
          JSON.parse(JSON.stringify(newDisplayedRegion)),
        ])
        view.navToLocString(locString)
      } catch (e) {
        session.notify(`${e}`, 'error')
      }
    }
  }
}
