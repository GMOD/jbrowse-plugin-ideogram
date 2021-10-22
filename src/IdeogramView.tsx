import Ideogram from 'ideogram'
import React, { useEffect, useRef, useMemo } from 'react'
import { observer } from 'mobx-react'

let iter = 0
const IdeogramView = observer(({ model }: { model: any }) => {
  console.log(model)
  const ref = useRef<HTMLDivElement>(null)
  const identifier = useMemo(() => {
    iter++
    return 'ideo-container-' + iter
  }, [])

  var config = {
    organism: 'human',
    sex: model.sex,
    chrHeight: 300,
    chrWidth: 10,
    ploidy: model.pliody,
    rotatable: false,
    orientation: model.orientation,
    container: '#' + identifier,
  }

  useEffect(() => {
    if (ref.current) {
      return new Ideogram(config)
    }
  }, [model.sex, model.orientation, model.pliody])

  return <div ref={ref} id={identifier} style={{ paddingTop: '5px' }}></div>
})

export default IdeogramView
