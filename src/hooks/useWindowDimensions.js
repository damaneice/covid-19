import { useState, useEffect } from "react"

function getWindowDimensions() {
  if (typeof window !== "undefined") {
    return { height: window.innerHeight, width: window.innerWidth }
  } else {
    return { height: 0, width: 0 }
  }
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowDimensions
}
