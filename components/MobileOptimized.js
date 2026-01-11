import { useState, useEffect } from 'react'

// 响应式表格组件，移动端自动转为卡片布局
function ResponsiveTable({ 
  headers, 
  data, 
  className = '',
  tableClassName = '',
  cardClassName = '',
  emptyMessage = '暂无数据'
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!data || data.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <div className="text-2xl mb-2">📋</div>
        <div>{emptyMessage}</div>
      </div>
    )
  }

  // 移动端卡片布局
  if (isMobile) {
    return (
      <div className={`space-y-4 ${className}`}>
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm ${cardClassName}`}
          >
            <div className="space-y-3">
              {headers.map((header, colIndex) => (
                <div key={colIndex} className="flex justify-between items-start">
                  <div className="text-sm font-medium text-gray-600 min-w-0 flex-shrink-0">
                    {header.label}
                  </div>
                  <div className="text-sm text-gray-900 text-right min-w-0 flex-1 ml-2">
                    {row[header.key] !== undefined ? row[header.key] : '-'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 桌面端表格布局
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className={`w-full border-collapse ${tableClassName}`}>
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
                style={{ minWidth: header.minWidth || 'auto' }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 border-b border-gray-100 transition-colors"
            >
              {headers.map((header, colIndex) => (
                <td
                  key={colIndex}
                  className="px-4 py-3 text-sm text-gray-900 border-b border-gray-100"
                >
                  {row[header.key] !== undefined ? row[header.key] : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 触摸友好的按钮组件
function TouchButton({ 
  children, 
  onClick, 
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props 
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
    minHeight: '44px',
    minWidth: '44px',
    padding: '0 16px'
  }

  const variants = {
    primary: {
      backgroundColor: '#87A96B',
      color: 'white',
      boxShadow: '0 2px 8px rgba(135, 169, 107, 0.3)',
      '&:hover:not(:disabled)': {
        backgroundColor: '#6B8553',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(135, 169, 107, 0.4)'
      }
    },
    secondary: {
      backgroundColor: '#f8f9fa',
      color: '#495057',
      border: '2px solid #e9ecef',
      '&:hover:not(:disabled)': {
        backgroundColor: '#e9ecef',
        borderColor: '#dee2e6'
      }
    },
    danger: {
      backgroundColor: '#dc3545',
      color: 'white',
      boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
      '&:hover:not(:disabled)': {
        backgroundColor: '#c82333',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(220, 53, 69, 0.4)'
      }
    }
  }

  const sizes = {
    small: {
      fontSize: '14px',
      padding: '8px 12px',
      minHeight: '36px'
    },
    medium: {
      fontSize: '16px',
      padding: '10px 16px',
      minHeight: '44px'
    },
    large: {
      fontSize: '18px',
      padding: '12px 20px',
      minHeight: '48px'
    }
  }

  const buttonStyle = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
    opacity: disabled || loading ? 0.6 : 1,
    ...props.style
  }

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}

// 触摸友好的输入组件
function TouchInput({ 
  label, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  error = '',
  disabled = false,
  className = '',
  ...props 
}) {
  const inputStyle = {
    width: '100%',
    minHeight: '44px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: `2px solid ${error ? '#dc3545' : '#e9ecef'}`,
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: disabled ? '#f8f9fa' : 'white',
    color: disabled ? '#6c757d' : '#495057'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={inputStyle}
        {...props}
      />
      {error && (
        <div className="text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

export {
  ResponsiveTable,
  TouchButton,
  TouchInput
}
