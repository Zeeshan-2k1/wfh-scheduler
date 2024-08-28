import { useState, useEffect } from 'react'

const useScreenSize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>()

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { isSmallScreen }
}

export default useScreenSize
