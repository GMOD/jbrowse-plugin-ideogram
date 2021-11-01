import { FileLocation } from '@jbrowse/core/util/types'
import { openLocation } from '@jbrowse/core/util/io'

/**
 * generates annotations in the form of two objects, one for the ideogram and one for the widget
 *  using a provided location of a TSV file
 *  the widget and ideo members differ in that the widget object has properties required by the ideogram
 *  library to render the annotations properly and the ideo object has properties formatted and
 *  distributed in a way that reads better for the IdeogramFeatureWidget when clicked
 * @param location - the location of the TSV file to be turned into annotations on the ideogram
 * @returns widget object and ideo object from the TSV provided information
 */
export async function generateAnnotations(location: FileLocation) {
  const ideo: any = []
  const widget: any = []

  const { lines, columns } = await readAnnot(location)

  lines.forEach((line: string) => {
    ideo.push(parseLine(line, columns))
    widget.push(widgetfy(parseLine(line, columns)))
  })

  return { widget, ideo }
}

/**
 * converts the parsed line into the object we want to store for the widget to use for onClick information
 *   this would have 'end' instead of 'stop' and not contain the stop, color, and chr properties
 * @param obj - the parsed object from the file
 */
function widgetfy(obj: any) {
  const newObj = obj
  newObj['end'] = newObj.stop
  delete newObj.stop
  delete newObj.color
  delete newObj.chr

  return newObj
}

async function readAnnot(location: FileLocation) {
  const fileContents = (await openLocation(location).readFile('utf8')) as string

  const lines = fileContents.split('\n')
  const rows: string[] = []
  let columns: string[] = []
  lines.forEach(line => {
    if (line) {
      if (columns.length === 0) {
        columns = line.split('\t')
      } else {
        rows.push(line)
      }
    }
  })

  return {
    lines: rows,
    columns,
  }
}

/**
 * from https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
 * @param str - the string to camelize
 * @returns the camelized string
 */
function camelize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

function parseCoords(property: string) {
  const splitProperty = property.split(':')
  return {
    chr: splitProperty[0],
    start: +splitProperty[1].split('-')[0],
    stop: +splitProperty[1].split('-')[1],
  }
}

/**
 * converts the contents of the tsv file into an object that can be used
 *   places 'core' properties (name, chr, start, stop) at the start of the object, and the details in their own sub-object
 * @param line - the string representation of the line being converted to an object
 * @param columns - the columns of the data from the tsv
 * @returns the object representation of the line of data
 */
function parseLine(line: string, columns: string[]) {
  let annot: any = { details: {} }
  line.split('\t').forEach((property: string, i: number) => {
    if (property) {
      const camelProp = camelize(columns[i])
      if (camelProp === 'geneSymbol') {
        annot['name'] = property
      }
      if (camelProp === 'genomeLocation') {
        const parsedProperties = parseCoords(property)
        if (parsedProperties.start > 0 && parsedProperties.stop > 0) {
          annot = {
            ...annot,
            ...parsedProperties,
          }
        }
      }
      if (camelProp === 'externalLinks') {
        property = JSON.parse(property)
      }
      if (camelProp === 'tier') {
        // if the property 'tier' exists, apply colour logic
        const a = '#0000FF' // blue
        const b = '#FF0000' // red
        if (property === '1') {
          annot['color'] = a
        } else {
          annot['color'] = b
        }
      }
      annot['details'][camelProp] = property
    }
  })
  return annot
}
