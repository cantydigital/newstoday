import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '6px',
          position: 'relative',
        }}
      >
        {/* Newspaper icon */}
        <div
          style={{
            width: '20px',
            height: '16px',
            background: 'white',
            borderRadius: '2px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '2px',
          }}
        >
          {/* Header line */}
          <div
            style={{
              width: '100%',
              height: '2px',
              background: '#1a1a1a',
              marginBottom: '1px',
            }}
          />
          {/* Content lines */}
          <div
            style={{
              width: '80%',
              height: '1px',
              background: '#666',
              marginBottom: '1px',
            }}
          />
          <div
            style={{
              width: '70%',
              height: '1px',
              background: '#666',
              marginBottom: '1px',
            }}
          />
          <div
            style={{
              width: '90%',
              height: '1px',
              background: '#666',
              marginBottom: '1px',
            }}
          />
          <div
            style={{
              width: '60%',
              height: '1px',
              background: '#666',
            }}
          />
        </div>
        {/* News indicator dot */}
        <div
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '4px',
            height: '4px',
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
