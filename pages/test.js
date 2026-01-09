import { createSupabaseClient } from '../lib/supabase';
import { useState, useEffect } from 'react';

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [heroSlides, setHeroSlides] = useState([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Testing Supabase connection...');
        const supabase = createSupabaseClient();
        
        // Test basic connection
        const { data, error } = await supabase.from('admin_credentials').select('count').single();
        
        if (error) {
          console.error('❌ Supabase connection failed:', error);
          setConnectionStatus(`❌ Connection failed: ${error.message}`);
        } else {
          console.log('✅ Supabase connection successful');
          setConnectionStatus('✅ Connected successfully');
        }
      } catch (error) {
        console.error('❌ Critical error:', error);
        setConnectionStatus(`❌ Critical error: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      background: '#f5f5f5'
    }}>
      <h1>🔧 PawSafePlants Debug Page</h1>
      
      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ddd'
      }}>
        <h2>📡 Supabase Connection Status</h2>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{connectionStatus}</p>
      </div>

      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #ddd'
      }}>
        <h2>🎯 Hero Carousel Test</h2>
        <p>Slides loaded: {heroSlides.length}</p>
      </div>

      <div style={{ 
        background: '#fff', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h2>🔍 Environment Variables</h2>
        <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
        <p>SUPABASE_SERVICE_ROLE_KEY: {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ 
          background: '#87A96B', 
          color: '#fff', 
          padding: '10px 20px', 
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          🏠 Back to Home
        </a>
      </div>
    </div>
  );
}
