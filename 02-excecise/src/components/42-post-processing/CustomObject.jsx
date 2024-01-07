import React, { memo, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

const CustomObject = memo(() => {
  const vertexesCount = 10 * 3
  const positions = useMemo(() => {
    const positions = Float32Array.from(
      {
        length: vertexesCount * 3
      },
      () => THREE.MathUtils.randFloatSpread(2)
    )
    return positions
  }, [])

  const geometryRef = useRef(null)
  useEffect(() => {
    console.log(geometryRef.current)
    geometryRef.current.computeVertexNormals() // 计算顶点法线, 用于光照计算
  }, [])
  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          // args={[positions, 3]}
          count={vertexesCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <meshStandardMaterial color={'red'} side={THREE.DoubleSide} />
    </mesh>
  )
})

export default CustomObject
