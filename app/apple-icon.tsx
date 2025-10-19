import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '32px',
          position: 'relative',
        }}
      >
        {/* Newspaper icon - larger version */}
        <div
          style={{
            width: '120px',
            height: '96px',
            background: 'white',
            borderRadius: '12px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px',
          }}
        >
          {/* Header line */}
          <div
            style={{
              width: '100%',
              height: '12px',
              background: '#1a1a1a',
              marginBottom: '8px',
              borderRadius: '2px',
            }}
          />
          {/* Content lines */}
          <div
            style={{
              width: '80%',
              height: '6px',
              background: '#666',
              marginBottom: '6px',
              borderRadius: '1px',
            }}
          />
          <div
            style={{
              width: '70%',
              height: '6px',
              background: '#666',
              marginBottom: '6px',
              borderRadius: '1px',
            }}
          />
          <div
            style={{
              width: '90%',
              height: '6px',
              background: '#666',
              marginBottom: '6px',
              borderRadius: '1px',
            }}
          />
          <div
            style={{
              width: '60%',
              height: '6px',
              background: '#666',
              borderRadius: '1px',
            }}
          />
        </div>
        {/* News indicator dot */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '24px',
            height: '24px',
            background: '#ef4444',
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
