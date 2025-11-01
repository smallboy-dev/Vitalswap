import React, { useEffect, useRef, useState } from 'react'

export default function VideoHelp() {
  const [consent, setConsent] = useState(false)
  const [role, setRole] = useState(null) // 'user' or 'agent'
  const [agentCode, setAgentCode] = useState('')
  const [joined, setJoined] = useState(false)
  const [participants, setParticipants] = useState([])
  const [recording, setRecording] = useState(false)
  const [lobby, setLobby] = useState(true)
  const [error, setError] = useState(null)
  const [notes, setNotes] = useState('')
  const [agentAvailable, setAgentAvailable] = useState(true)
  
  const dailyFrameRef = useRef(null)
  const dailyCallRef = useRef(null)

  // Daily.co Room URL (hardcoded)
  const DAILY_ROOM_URL = 'https://vitaswap.daily.co/vitalswap'
  
  // Agent settings (hardcoded)
  const AGENT_AVAILABLE = true
  const VIDEO_RECORDING = true
  const AGENT_CODE = 'vitalswap123'
  

  useEffect(() => {
    // Check agent availability from env or default
    setAgentAvailable(AGENT_AVAILABLE !== false)
    
    // Add CSS animations and responsive styles (only once)
    if (!document.getElementById('video-help-styles')) {
      const styleSheet = document.createElement('style')
      styleSheet.id = 'video-help-styles'
      styleSheet.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        /* Dark mode styles */
        :root[data-theme="dark"] #video-help .video-help-container {
          background: #0b1220 !important;
        }
        :root[data-theme="dark"] #video-help .video-help-container h2,
        :root[data-theme="dark"] #video-help .video-help-container h3,
        :root[data-theme="dark"] #video-help .video-help-container h4 {
          color: #e2e8f0 !important;
        }
        :root[data-theme="dark"] #video-help .video-help-consent-card,
        :root[data-theme="dark"] #video-help .video-help-role-card {
          background: #111827 !important;
          border-color: #1f2937 !important;
          box-shadow: 0 10px 15px rgba(0,0,0,0.4), 0 4px 6px rgba(0,0,0,0.35) !important;
        }
        :root[data-theme="dark"] #video-help .video-help-consent-title,
        :root[data-theme="dark"] #video-help .video-help-role-title {
          color: #e5e7eb !important;
        }
        :root[data-theme="dark"] #video-help .video-help-consent-text,
        :root[data-theme="dark"] #video-help .video-help-role-description {
          color: #cbd5e1 !important;
        }
        :root[data-theme="dark"] #video-help .video-help-consent-list {
          color: #cbd5e1 !important;
        }
        :root[data-theme="dark"] #video-help .video-help-checkbox-label {
          color: #e5e7eb !important;
        }
        :root[data-theme="dark"] #video-help .video-help-code-input {
          background: #111827 !important;
          color: #e5e7eb !important;
          border-color: #374151 !important;
        }
        :root[data-theme="dark"] #video-help .video-help-code-input::placeholder {
          color: #9ca3af !important;
        }
        :root[data-theme="dark"] #video-help .video-help-text-button {
          color: #cbd5e1 !important;
        }
        :root[data-theme="dark"] #video-help .video-help-error {
          background: #7f1d1d !important;
          color: #fecaca !important;
        }
        :root[data-theme="dark"] #video-help .video-help-warning {
          background: #78350f !important;
          color: #fde68a !important;
        }
        :root[data-theme="dark"] #video-help .video-help-error-banner {
          background: #7f1d1d !important;
          color: #fecaca !important;
        }
        :root[data-theme="dark"] #video-help .video-help-error-banner button {
          color: #fecaca !important;
        }
        
        @media (max-width: 768px) {
          #video-help .video-help-container {
            padding: 16px !important;
          }
          #video-help .video-help-video-container {
            min-height: 400px !important;
            border-radius: 12px !important;
          }
          #video-help .video-help-video-frame {
            height: 400px !important;
          }
          #video-help .video-help-role-selection {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          #video-help .video-help-controls {
            padding: 12px !important;
            gap: 8px !important;
            bottom: 8px !important;
            left: 8px !important;
            right: 8px !important;
          }
        }
      `
      document.head.appendChild(styleSheet)
    }
    
    // Cleanup on unmount
    return () => {
      if (dailyCallRef.current) {
        dailyCallRef.current.leave().catch(console.error)
      }
    }
  }, [])

  const handleConsent = () => {
    if (!consent) {
      setError('Please accept the terms to continue')
      return
    }
    // Consent accepted, show role selection
  }

  const handleJoinAsUser = async () => {
    if (!DAILY_ROOM_URL) {
      setError('Video service is not configured. Please contact support.')
      return
    }

    setError(null)
    setRole('user')
    
    try {
      // Dynamic import to avoid CORS issues
      const { default: DailyIframe } = await import('@daily-co/daily-js')
      
      const callFrame = DailyIframe.createFrame(dailyFrameRef.current, {
        showLeaveButton: true,
        iframeStyle: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: 0,
        },
      })

      dailyCallRef.current = callFrame

      // Event listeners
      callFrame.on('joined-meeting', (e) => {
        setJoined(true)
        setLobby(false)
        console.log('Joined meeting:', e)
      })

      callFrame.on('left-meeting', () => {
        setJoined(false)
        setLobby(true)
        dailyCallRef.current = null
      })

      callFrame.on('participant-joined', (e) => {
        console.log('Participant joined:', e)
        setParticipants(prev => [...prev, e.participant])
        if (e.participant.user_name?.includes('agent') || e.participant.user_name?.includes('Agent')) {
          setLobby(false)
        }
      })

      callFrame.on('participant-left', (e) => {
        setParticipants(prev => prev.filter(p => p.session_id !== e.participant.session_id))
      })

      callFrame.on('recording-started', () => {
        setRecording(true)
      })

      callFrame.on('recording-stopped', () => {
        setRecording(false)
      })

      callFrame.on('error', (e) => {
        console.error('Daily error:', e)
        setError(e.errorMsg || 'An error occurred during the video call')
        setJoined(false)
      })

      // Join the room
      await callFrame.join({
        url: DAILY_ROOM_URL,
        userName: 'VitalSwap User',
        userData: JSON.stringify({ role: 'user' }),
      })
    } catch (err) {
      console.error('Join error:', err)
      setError(err.message || 'Failed to connect. Please try again.')
      setRole(null)
    }
  }

  const handleJoinAsAgent = async () => {
    if (!DAILY_ROOM_URL) {
      setError('Video service is not configured. Please contact support.')
      return
    }

    const code = agentCode.trim()
    
    // Check if agent code is configured
    if (!AGENT_CODE) {
      setError('Agent code is not configured. Please set VITE_VIDEO_AGENT_CODE in your .env file.')
      console.error('VITE_VIDEO_AGENT_CODE is not set in environment variables')
      return
    }

    // Check if code was entered
    if (!code) {
      setError('Please enter an agent code.')
      return
    }

    // Compare codes (case-insensitive for better UX)
    if (code.toLowerCase() !== AGENT_CODE.toLowerCase()) {
      setError('Invalid agent code. Please check and try again.')
      console.warn('Agent code mismatch:', { entered: code, expected: AGENT_CODE })
      return
    }

    setError(null)
    setRole('agent')
    
    try {
      // Dynamic import to avoid CORS issues
      const { default: DailyIframe } = await import('@daily-co/daily-js')
      
      const callFrame = DailyIframe.createFrame(dailyFrameRef.current, {
        showLeaveButton: true,
        iframeStyle: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: 0,
        },
      })

      dailyCallRef.current = callFrame

      // Event listeners (same as user)
      callFrame.on('joined-meeting', (e) => {
        setJoined(true)
        setLobby(false)
        console.log('Agent joined meeting:', e)
      })

      callFrame.on('left-meeting', () => {
        setJoined(false)
        setLobby(true)
        dailyCallRef.current = null
      })

      callFrame.on('participant-joined', (e) => {
        setParticipants(prev => [...prev, e.participant])
      })

      callFrame.on('participant-left', (e) => {
        setParticipants(prev => prev.filter(p => p.session_id !== e.participant.session_id))
      })

      callFrame.on('recording-started', () => {
        setRecording(true)
      })

      callFrame.on('recording-stopped', () => {
        setRecording(false)
      })

      callFrame.on('error', (e) => {
        console.error('Daily error:', e)
        setError(e.errorMsg || 'An error occurred during the video call')
        setJoined(false)
      })

      // Join as agent
      await callFrame.join({
        url: DAILY_ROOM_URL,
        userName: 'VitalSwap Agent',
        userData: JSON.stringify({ role: 'agent' }),
      })
    } catch (err) {
      console.error('Agent join error:', err)
      setError(err.message || 'Failed to connect as agent. Please try again.')
      setRole(null)
    }
  }

  const handleLeave = async () => {
    if (dailyCallRef.current) {
      try {
        await dailyCallRef.current.leave()
      } catch (err) {
        console.error('Leave error:', err)
      }
    }
    setJoined(false)
    setRole(null)
    setLobby(true)
    setParticipants([])
    setRecording(false)
    if (dailyFrameRef.current) {
      dailyFrameRef.current.innerHTML = ''
    }
  }

  const handleSendNote = () => {
    if (!notes.trim()) return
    // In a real implementation, you might send this via Daily's chat or your own API
    console.log('Note sent:', notes)
    setNotes('')
    // You could also send via Daily's sendAppMessage
    if (dailyCallRef.current) {
      try {
        dailyCallRef.current.sendAppMessage({ type: 'note', message: notes }, '*')
      } catch (err) {
        console.error('Failed to send note:', err)
      }
    }
  }

  if (!consent) {
    return (
      <section id="video-help" className="video-help-container" style={styles.container}>
        <div style={styles.content}>
          <h2 style={styles.title}>Video Help - Connect with VitalSwap Agent</h2>
          <div className="video-help-consent-card" style={styles.consentCard}>
            <h3 className="video-help-consent-title" style={styles.consentTitle}>Terms & Consent</h3>
            <div className="video-help-consent-text" style={styles.consentText}>
              <p>By using Video Help, you agree to:</p>
              <ul className="video-help-consent-list" style={styles.consentList}>
                <li>Maintain professional and respectful communication</li>
                <li>Not record or share the video call without consent</li>
                <li>Use this service only for legitimate VitalSwap inquiries</li>
                {VIDEO_RECORDING && (
                  <li>This session may be recorded for quality and training purposes</li>
                )}
              </ul>
            </div>
            <div style={styles.consentActions}>
              <label className="video-help-checkbox-label" style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked)
                    setError(null)
                  }}
                  style={styles.checkbox}
                />
                <span>I accept the terms and conditions</span>
              </label>
              <button
                onClick={handleConsent}
                disabled={!consent}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  opacity: consent ? 1 : 0.6,
                  cursor: consent ? 'pointer' : 'not-allowed',
                }}
              >
                Continue
              </button>
            </div>
            {error && <div className="video-help-error" style={styles.error}>{error}</div>}
          </div>
        </div>
      </section>
    )
  }

  if (!role) {
    return (
      <section id="video-help" className="video-help-container" style={styles.container}>
        <div style={styles.content}>
          <h2 style={styles.title}>Video Help - Choose Your Role</h2>
          <div className="video-help-role-selection" style={styles.roleSelection}>
            <div className="video-help-role-card" style={styles.roleCard}>
              <h3 className="video-help-role-title" style={styles.roleTitle}>Join as User</h3>
              <p className="video-help-role-description" style={styles.roleDescription}>
                Connect with a VitalSwap agent for assistance with your account, transactions, or general inquiries.
              </p>
              {!agentAvailable && (
                <div className="video-help-warning" style={styles.warning}>
                  ⚠️ Agents are currently unavailable. Please try again later.
                </div>
              )}
              <button
                onClick={handleJoinAsUser}
                disabled={!agentAvailable}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  opacity: agentAvailable ? 1 : 0.6,
                  cursor: agentAvailable ? 'pointer' : 'not-allowed',
                }}
              >
                Connect to Agent
              </button>
            </div>
            <div className="video-help-role-card" style={styles.roleCard}>
              <h3 className="video-help-role-title" style={styles.roleTitle}>Join as Agent</h3>
              <p className="video-help-role-description" style={styles.roleDescription}>
                Are you a VitalSwap team member? Enter your agent code to join as support staff.
              </p>
              <input
                type="password"
                placeholder="Enter agent code"
                value={agentCode}
                onChange={(e) => {
                  setAgentCode(e.target.value)
                  setError(null)
                }}
                className="video-help-code-input"
                style={styles.codeInput}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleJoinAsAgent()
                  }
                }}
              />
              <button
                onClick={handleJoinAsAgent}
                style={{ ...styles.button, ...styles.secondaryButton }}
              >
                Join as Agent
              </button>
            </div>
          </div>
          {error && <div className="video-help-error" style={styles.error}>{error}</div>}
        </div>
      </section>
    )
  }

  return (
    <section id="video-help" className="video-help-container" style={styles.container}>
      <div className="video-help-video-container" style={styles.videoContainer}>
        {recording && VIDEO_RECORDING && (
          <div style={styles.recordingBanner}>
            <span style={styles.recordingDot}></span>
            Recording in progress
          </div>
        )}
        
        {lobby && joined && (
          <div style={styles.lobby}>
            <div style={styles.lobbyContent}>
              <div style={styles.spinner}></div>
              <h3>Waiting for agent...</h3>
              <p>An agent will join shortly. Please wait.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="video-help-error-banner" style={styles.errorBanner}>
            {error}
            <button onClick={() => setError(null)} style={styles.closeError}>×</button>
          </div>
        )}

        <div ref={dailyFrameRef} className="video-help-video-frame" style={styles.videoFrame}></div>

        {joined && (
          <div className="video-help-controls" style={styles.controls}>
            <div style={styles.notesSection}>
              <h4 style={styles.notesTitle}>Session Notes</h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this session..."
                style={styles.notesInput}
                rows={3}
              />
              <button onClick={handleSendNote} style={{ ...styles.button, ...styles.smallButton }}>
                Save Note
              </button>
            </div>
            
            <button
              onClick={handleLeave}
              style={{ ...styles.button, ...styles.dangerButton }}
            >
              Leave Call
            </button>
          </div>
        )}

        {!joined && role && (
          <div style={styles.connecting}>
            <div style={styles.spinner}></div>
            <p>Connecting...</p>
          </div>
        )}
      </div>
    </section>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    background: '#f8fafc',
    transition: 'background 0.3s',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: 'clamp(24px, 5vw, 32px)',
    fontWeight: 700,
    marginBottom: '32px',
    textAlign: 'center',
    color: '#1e293b',
  },
  consentCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  consentTitle: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '20px',
    color: '#1e293b',
  },
  consentText: {
    marginBottom: '24px',
    color: '#64748b',
    lineHeight: '1.6',
  },
  consentList: {
    marginTop: '12px',
    paddingLeft: '24px',
    listStyle: 'disc',
  },
  consentActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: '#1e293b',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  roleSelection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  roleCard: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  roleTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#1e293b',
  },
  roleDescription: {
    color: '#64748b',
    lineHeight: '1.6',
    flex: 1,
  },
  warning: {
    background: '#fef3c7',
    color: '#92400e',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  codeInput: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    fontSize: '16px',
    background: '#ffffff',
    color: '#1e293b',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  primaryButton: {
    background: '#04396D',
    color: '#ffffff',
  },
  secondaryButton: {
    background: '#FFB806',
    color: '#1e293b',
  },
  textButton: {
    background: 'transparent',
    color: '#1e293b',
    textDecoration: 'underline',
  },
  dangerButton: {
    background: '#ef4444',
    color: '#ffffff',
  },
  smallButton: {
    padding: '8px 16px',
    fontSize: '14px',
  },
  error: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '8px',
    marginTop: '16px',
    fontSize: '14px',
  },
  videoContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    background: '#000000',
    borderRadius: '16px',
    overflow: 'hidden',
    minHeight: '600px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  videoFrame: {
    width: '100%',
    height: '600px',
    position: 'relative',
  },
  recordingBanner: {
    position: 'absolute',
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#dc2626',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  recordingDot: {
    width: '8px',
    height: '8px',
    background: '#ffffff',
    borderRadius: '50%',
    animation: 'pulse 1s infinite',
  },
  errorBanner: {
    position: 'absolute',
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#fee2e2',
    color: '#991b1b',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  closeError: {
    background: 'transparent',
    border: 'none',
    color: '#991b1b',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0',
    width: '24px',
    height: '24px',
  },
  lobby: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  lobbyContent: {
    textAlign: 'center',
    color: '#ffffff',
  },
  connecting: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: '#ffffff',
    zIndex: 999,
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTop: '4px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  },
  controls: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    right: '16px',
    background: 'rgba(0,0,0,0.8)',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 1000,
  },
  notesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  notesTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    margin: 0,
  },
  notesInput: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
    fontSize: '14px',
    resize: 'vertical',
  },
}

