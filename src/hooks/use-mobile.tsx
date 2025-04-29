
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with null to avoid hydration mismatch
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    // Define the check function with more detailed logging
    const checkIfMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      console.log(`[Mobile Detection] Screen width: ${window.innerWidth}, isMobile: ${mobile}`)
      setIsMobile(mobile)
    }
    
    // Add event listener with passive option for better performance
    window.addEventListener('resize', checkIfMobile, { passive: true })
    
    // Initial check on mount with a slight delay to ensure proper rendering
    requestAnimationFrame(() => {
      checkIfMobile()
      console.log("[Mobile Detection] Initial check complete")
    })
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Return false as default during SSR or until detection is complete
  return isMobile !== null ? isMobile : false
}
