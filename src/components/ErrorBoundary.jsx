import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
    this.setState({ info })
  }

  render() {
    if (this.state.error) {
      const stack = this.state.error?.stack || ''
      const firstLine = stack.split('\n').slice(0, 4).join('\n')
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#faf5ea',
            color: '#3a2a18',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              border: '1px solid rgba(197,155,39,0.5)',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              padding: '28px 32px',
              boxShadow: '0 18px 44px rgba(11,42,91,0.18)',
            }}
          >
            <h1 style={{ margin: '0 0 8px', color: '#C8102E', fontSize: '20px', fontWeight: 700, fontFamily: 'Cinzel, serif' }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: '14px', margin: '0 0 16px' }}>
              Alpine Explorers hit an unexpected error. The message below will help your developer pinpoint it.
            </p>
            <pre
              style={{
                background: '#f4efe3',
                padding: '14px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '300px',
                overflow: 'auto',
                margin: '0 0 18px',
              }}
            >
              {String(this.state.error?.message || this.state.error)}
              {'\n\n'}
              {firstLine}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#001a4d',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 22px',
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}