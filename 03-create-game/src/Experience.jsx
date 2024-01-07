import Lights from './Lights.jsx'
import {
  // Debug,
  Physics
} from '@react-three/rapier'
import Level from './Level.jsx'
// import { Perf } from 'r3f-perf'
import Player from './Player.jsx'
import { useGame } from './store/useGame.js'
import Effects from './Effects.jsx'

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount)
  const blocksSeed = useGame((state) => state.blocksSeed)
  return (
    <>
      <Lights />

      {/* <Perf position="top-left" /> */}

      <Physics>
        {/* <Debug /> */}
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>

      <Effects />
    </>
  )
}
