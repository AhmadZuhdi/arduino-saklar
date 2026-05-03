import { useState, useCallback } from 'react'

export function useRelayState() {
  const [state, setState] = useState([0, 0, 0, 0])

  const toggleRelay = useCallback((channel) => {
    setState(prev => {
      const next = [...prev]
      next[channel - 1] = next[channel - 1] ? 0 : 1
      return next
    })
  }, [])

  const setRelayState = useCallback((channel, value) => {
    setState(prev => {
      const next = [...prev]
      next[channel - 1] = value ? 1 : 0
      return next
    })
  }, [])

  const getRelayState = (channel) => state[channel - 1]

  return { state, toggleRelay, setRelayState, getRelayState }
}
