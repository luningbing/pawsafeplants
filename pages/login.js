import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const sageGreen = '#87A96B';
  const warmCream = '#FAF7F2';

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        // Show success animation
        setIsSuccess(true);
        
        // Redirect after success animation
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      } else {
        // Show error with animation
        setError(data.error || '登录失败');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('网络错误，请重试');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - Safe Plants</title>
        <meta name="description" content="Admin login for Safe Plants management system" />
      </Head>
      
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${warmCream} 0%, #F5F1E8 100%)`,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle, ${sageGreen}10% 0%, transparent 70%)`,
          animation: 'float 20s infinite ease-in-out',
          opacity: 0.3
        }} />
        
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                backgroundColor: sageGreen,
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3,
                animation: `float ${10 + Math.random() * 20}s infinite ease-in-out`
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              style={{
                backgroundColor: 'white',
                padding: '3rem',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(135, 169, 107, 0.15)',
                width: '100%',
                maxWidth: '420px',
                margin: '0 2rem',
                position: 'relative',
                zIndex: 10
              }}
            >
              {/* Success checkmark */}
              {isSuccess && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px',
                    height: '40px',
                    backgroundColor: sageGreen,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px'
                  }}
                >
                  ✓
                </motion.div>
              )}

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <h1 style={{
                    color: sageGreen,
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    margin: '0 0 0.5rem 0'
                  }}>
                    🌿 Admin Login
                  </h1>
                  <p style={{
                    color: '#666',
                    fontSize: '1.1rem',
                    margin: 0
                  }}>
                    Safe Plants Management
                  </p>
                </motion.div>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      backgroundColor: '#fee',
                      color: '#c53030',
                      padding: '1rem',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      textAlign: 'center',
                      marginBottom: '1.5rem'
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#333',
                    fontWeight: '500',
                    fontSize: '0.95rem'
                  }}>
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = sageGreen;
                      e.target.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="输入用户名"
                    required
                    disabled={loading}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#333',
                    fontWeight: '500',
                    fontSize: '0.95rem'
                  }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        paddingRight: '3rem',
                        border: '2px solid #e0e0e0',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = sageGreen;
                        e.target.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.boxShadow = 'none';
                      }}
                      placeholder="输入密码"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        padding: '0.25rem'
                      }}
                    >
                      {showPassword ? '👁️' : '👁'}
                    </button>
                  </div>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: loading ? '#ccc' : sageGreen,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: loading ? 'none' : `0 8px 32px ${sageGreen}30%`
                  }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid white',
                        borderTop: 'none',
                        borderRight: 'none',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      登录中...
                    </span>
                  ) : (
                    '登录管理后台'
                  )}
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                style={{
                  marginTop: '2rem',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  color: '#666',
                  padding: '1rem',
                  backgroundColor: `${sageGreen}10`,
                  borderRadius: '12px'
                }}
              >
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                  默认登录信息
                </p>
                <p style={{ margin: 0, fontWeight: '500' }}>
                  用户名: <span style={{ color: sageGreen }}>laifu</span>
                </p>
                <p style={{ margin: 0, fontWeight: '500' }}>
                  密码: <span style={{ color: sageGreen }}>laifu123</span>
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                backgroundColor: 'white',
                padding: '4rem',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(135, 169, 107, 0.2)',
                width: '100%',
                maxWidth: '420px',
                margin: '0 2rem',
                textAlign: 'center',
                zIndex: 10
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: sageGreen,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2rem',
                  fontSize: '2rem',
                  color: 'white'
                }}
              >
                ✓
              </motion.div>
              <h2 style={{
                color: sageGreen,
                fontSize: '1.8rem',
                fontWeight: '700',
                margin: '0'
              }}>
                登录成功！
              </h2>
              <p style={{
                color: '#666',
                fontSize: '1rem',
                margin: '0.5rem 0'
              }}>
                正在跳转到管理后台...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating decoration */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          fontSize: '3rem',
          opacity: 0.1,
          animation: 'float 6s ease-in-out infinite'
        }}>
          🌿
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg;
          }
          to {
            transform: rotate(360deg;
          }
        }
      `}</style>
    </>
  );
}
