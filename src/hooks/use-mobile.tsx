
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with null to avoid hydration mismatch
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    // Define the check function
    const checkIfMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      console.log(`[Mobile Detection] Screen width: ${window.innerWidth}, isMobile: ${mobile}`)
      setIsMobile(mobile)
    }
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile)
    
    // Initial check on mount
    checkIfMobile()
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Return false as default during SSR or until detection is complete
  return isMobile !== null ? isMobile : false
}
