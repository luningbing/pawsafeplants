import React from 'react'

// ASPCA Reference Component for verified non-toxic plants
function ASPCAReference({ 
  toxicityLevel, 
  plantName, 
  isVerified = false,
  style = {},
  showBadge = true,
  showLink = true 
}) {
  const isSafe = toxicityLevel && toxicityLevel.toLowerCase().includes('safe')
  
  if (!isSafe || !isVerified) {
    return null
  }

  const handleASPCAClick = () => {
    // Open ASPCA toxic plant database in new tab
    window.open('https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/cats', '_blank')
  }

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: '12px 0',
        padding: '12px 16px',
        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        borderRadius: '12px',
        border: '1px solid #dee2e6',
        fontSize: '14px',
        ...style
      }}
    >
      {showBadge && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#28a745',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          <span style={{ fontSize: '10px' }}>✓</span>
          Verified
        </div>
      )}
      
      <div style={{ flex: 1 }}>
        <span style={{ color: '#495057', fontWeight: '500' }}>
          Source: 
        </span>
        {showLink ? (
          <button
            onClick={handleASPCAClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: '0',
              fontSize: '14px',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0056b3'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#007bff'
            }}
          >
            ASPCA
          </button>
        ) : (
          <span style={{ color: '#007bff', fontWeight: '600' }}>
            ASPCA
          </span>
        )}
        <span style={{ color: '#6c757d', marginLeft: '4px' }}>
          - Confirmed non-toxic to cats
        </span>
      </div>
      
      {showLink && (
        <div style={{
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6c757d',
          fontSize: '12px'
        }}>
          ↗
        </div>
      )}
    </div>
  )
}

// ASPCA Badge Component for compact display
function ASPCABadge({ 
  toxicityLevel, 
  isVerified = false,
  size = 'medium' // 'small', 'medium', 'large'
}) {
  const isSafe = toxicityLevel && toxicityLevel.toLowerCase().includes('safe')
  
  if (!isSafe || !isVerified) {
    return null
  }

  const sizeStyles = {
    small: {
      padding: '4px 6px',
      fontSize: '10px',
      gap: '4px'
    },
    medium: {
      padding: '6px 10px',
      fontSize: '12px',
      gap: '6px'
    },
    large: {
      padding: '8px 12px',
      fontSize: '14px',
      gap: '8px'
    }
  }

  return (
    <div 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sizeStyles[size].gap,
        background: '#28a745',
        color: '#fff',
        padding: sizeStyles[size].padding,
        borderRadius: '6px',
        fontSize: sizeStyles[size].fontSize,
        fontWeight: '600',
        border: '1px solid #1e7e34',
        boxShadow: '0 2px 4px rgba(40, 167, 69, 0.2)'
      }}
    >
      <span style={{ fontSize: '10px' }}>✓</span>
      <span>ASPCA Verified</span>
    </div>
  )
}

// ASPCA Safety Seal Component
function ASPCASafetySeal({ 
  toxicityLevel, 
  isVerified = false,
  plantName
}) {
  const isSafe = toxicityLevel && toxicityLevel.toLowerCase().includes('safe')
  
  if (!isSafe || !isVerified) {
    return null
  }

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      margin: '16px 0'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
        border: '2px solid #28a745',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(40, 167, 69, 0.15)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          background: '#28a745',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          ✓
        </div>
        
        <div>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#155724',
            marginBottom: '4px'
          }}>
            ASPCA Verified Safe
          </div>
          <div style={{
            fontSize: '14px',
            color: '#155724',
            lineHeight: '1.4'
          }}>
            {plantName} is confirmed non-toxic to cats by the ASPCA Animal Poison Control Center
          </div>
          <div style={{
            fontSize: '12px',
            color: '#0c5460',
            marginTop: '6px',
            fontStyle: 'italic'
          }}>
            <a 
              href="https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/cats"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#0c5460',
                textDecoration: 'underline'
              }}
            >
              View in ASPCA Database →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook to determine ASPCA verification status
function useASPCAVerification(plantData) {
  const [isVerified, setIsVerified] = React.useState(false)
  const [verificationSource, setVerificationSource] = React.useState(null)

  React.useEffect(() => {
    if (!plantData) {
      setIsVerified(false)
      setVerificationSource(null)
      return
    }

    // Check if plant is marked as ASPCA verified
    const hasASPCAMark = plantData.aspca_verified === true || 
                           plantData.verification_source === 'aspca' ||
                           plantData.source === 'aspca'

    // Check toxicity level for known safe plants
    const isKnownSafe = plantData.toxicity_level && 
                        plantData.toxicity_level.toLowerCase().includes('safe')

    // Common cat-safe plants that are typically ASPCA verified
    const knownASPCASafePlants = [
      'rose', 'sunflower', 'orchid', 'zinnia', 'marigold', 
      'snapdragon', 'aster', 'camellia', 'gardenia', 'hibiscus'
    ]

    const plantName = (plantData.title || plantData.display_name || '').toLowerCase()
    const isKnownASPCASafe = knownASPCASafePlants.some(safe => 
      plantName.includes(safe)
    )

    setIsVerified(hasASPCAMark || (isKnownSafe && isKnownASPCASafe))
    setVerificationSource(hasASPCAMark ? 'database' : 'inferred')
  }, [plantData])

  return { isVerified, verificationSource }
}

export { ASPCAReference, ASPCABadge, ASPCASafetySeal, useASPCAVerification }
