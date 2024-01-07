import React, { forwardRef, memo, useMemo } from 'react'
import DrunkEffect from './DrunkEffect'

const Drunk = forwardRef((props, ref) => {
  const drunkEffect = useMemo(() => new DrunkEffect(props), [props])
  return <primitive ref={ref} object={drunkEffect} />
})

export default memo(Drunk)
