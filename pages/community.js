import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Community() {
  const sageGreen = '#87A96B';
  const sageGreenDark = '#6B8553';
  const warmCream = '#FAF7F2';
  const warmCreamDark = '#F5F1E8';
  const borderRadius = '24px';

  // Static placeholder messages
  const [messages] = useState([
    {
      id: 1,
      author: 'Sarah M.',
      date: '2 days ago',
      content: 'Just wanted to share that my cat Max absolutely loves our new spider plant! He loves batting at the hanging pups. Thanks for the recommendation! 🐱🌿',
      likes: 12
    },
    {
      id: 2,
      author: 'Emma K.',
      date: '5 days ago',
      content: 'Finally found a cat-safe plant that my Luna won\'t destroy! The Boston Fern is thriving in our living room. Highly recommend for other cat parents!',
      likes: 8
    },
    {
      id: 3,
      author: 'James T.',
      date: '1 week ago',
      content: 'This site saved me from buying toxic plants. My Whiskers is curious about everything, so having a safe plant guide is a lifesaver. Thank you! 💚',
      likes: 15
    },
    {
      id: 4,
      author: 'Maya P.',
      date: '2 weeks ago',
      content: 'Created a whole pet-safe indoor garden using your plant database. Simba loves it and I love the peace of mind! 🌱✨',
      likes: 20
    }
  ]);

  return (
    <>
      <Head>
        <title>Community Stories - PawSafePlants</title>
        <meta 
          name="description" 
          content="Share your pet-safe plant stories and connect with fellow cat owners creating beautiful, safe indoor gardens." 
        />
      </Head>

      <div style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
        background: warmCream,
        minHeight: '100vh',
        padding: '20px 0 40px 0'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ 
            fontSize: '40px', 
            color: sageGreenDark, 
            marginBottom: 12,
            fontWeight: 700,
            letterSpacing: '-0.5px'
          }}>
            Community Stories
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#5A5A5A', 
            marginBottom: 32,
            lineHeight: 1.6
          }}>
            Connect with fellow cat owners sharing their pet-safe plant journeys. Read stories, share your own, and get inspired to create a beautiful, safe indoor garden.
          </p>

          {/* Coming Soon Banner */}
          <div style={{ 
            background: `linear-gradient(135deg, ${sageGreen}15, ${sageGreen}25)`,
            border: `2px solid ${sageGreen}40`,
            borderRadius: borderRadius,
            padding: '24px 32px',
            marginBottom: 32,
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: sageGreenDark,
              marginBottom: '8px'
            }}>
              🎉 Coming Soon!
            </div>
            <div style={{ 
              fontSize: '15px', 
              color: '#5A5A5A',
              lineHeight: 1.6
            }}>
              We're building an interactive community board where you can share photos, ask questions, and connect with other pet parents. Stay tuned!
            </div>
          </div>

          {/* Placeholder Messages */}
          <div style={{ 
            background: '#fff',
            borderRadius: borderRadius,
            border: `2px solid ${warmCreamDark}`,
            padding: '32px',
            marginBottom: 24,
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              color: sageGreenDark, 
              marginBottom: 24,
              fontWeight: 600
            }}>
              Recent Stories
            </h2>

            <div style={{ display: 'grid', gap: 24 }}>
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  style={{
                    padding: '20px',
                    background: warmCream,
                    borderRadius: '16px',
                    border: `1px solid ${warmCreamDark}`,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = sageGreen + '40';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(135, 169, 107, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = warmCreamDark;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: 12
                  }}>
                    <div>
                      <div style={{ 
                        fontWeight: 700, 
                        fontSize: '16px', 
                        color: sageGreenDark,
                        marginBottom: '4px'
                      }}>
                        {msg.author}
                      </div>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#888'
                      }}>
                        {msg.date}
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      color: '#888',
                      fontSize: '14px'
                    }}>
                      <span>❤️</span>
                      <span>{msg.likes}</span>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '15px', 
                    color: '#2D2D2D',
                    lineHeight: 1.7
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share Your Story Section */}
          <div style={{ 
            background: '#fff',
            borderRadius: borderRadius,
            border: `2px solid ${warmCreamDark}`,
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              color: sageGreenDark, 
              marginBottom: 12,
              fontWeight: 600
            }}>
              Share Your Story
            </h2>
            <p style={{ 
              fontSize: '15px', 
              color: '#5A5A5A',
              marginBottom: 24,
              lineHeight: 1.6
            }}>
              Once the community board launches, you'll be able to share photos of your cat with their favorite plants, ask questions, and connect with others!
            </p>
            <div style={{ 
              padding: '20px',
              background: warmCream,
              borderRadius: '16px',
              border: `2px dashed ${sageGreen}40`
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📸</div>
              <div style={{ 
                fontSize: '14px', 
                color: '#888',
                fontStyle: 'italic'
              }}>
                Upload feature coming soon
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Link 
              href="/"
              style={{ 
                display: 'inline-block',
                padding: '12px 24px',
                background: sageGreen,
                color: '#fff',
                textDecoration: 'none',
                borderRadius: borderRadius,
                fontWeight: 600,
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = sageGreenDark;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(135, 169, 107, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = sageGreen;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

