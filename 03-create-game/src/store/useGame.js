import { create } from 'zustand'
// import { createWithEqualityFn } from 'zustand/traditional'
import { subscribeWithSelector } from 'zustand/middleware'
export const useGame = create(
  subscribeWithSelector((set) => ({
    blocksCount: 3,
    blocksSeed: 0,
    /**
     * @type {'ready' | 'playing' | 'ending'}
     */
    phase: 'ready',
    startTime: 0,
    endTime: 0,
    start: () => set((state) => (state.phase === 'ready' ? { phase: 'playing', startTime: Date.now() } : {})),
    end: () => set((state) => (state.phase === 'playing' ? { phase: 'ending', endTime: Date.now() } : {})),
    restart: () =>
      set((state) => {
        if (state.phase === 'playing' || state.phase === 'ending') {
          return {
            phase: 'ready',
            blocksSeed: Math.random()
          }
        }
        return {}
      })
  }))
)
