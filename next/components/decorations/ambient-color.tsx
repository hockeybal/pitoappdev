import React from 'react';

export const AmbientColor = () => {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none">
      <div
        style={{
          transform: 'translateY(-350px) rotate(-45deg)',
          width: '560px',
          height: '1380px',
          background:
            'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 70%, 70%, .04) 0, hsla(210, 60%, 65%, .01) 50%, hsla(210, 50%, 60%, 0) 80%)',
        }}
        className="absolute top-0 left-0"
      />

      <div
        style={{
          transform: 'rotate(-45deg) translate(5%, -50%)',
          transformOrigin: 'top left',
          width: '240px',
          height: '1380px',
          background:
            'radial-gradient(50% 50% at 50% 50%, hsla(210, 60%, 75%, .03) 0, hsla(210, 50%, 70%, .01) 80%, transparent 100%)',
        }}
        className="absolute top-0 left-0"
      />

      <div
        style={{
          position: 'absolute',
          borderRadius: '20px',
          transform: 'rotate(-45deg) translate(-180%, -70%)',
          transformOrigin: 'top left',
          top: 0,
          left: 0,
          width: '240px',
          height: '1380px',
          background:
            'radial-gradient(50% 50% at 50% 50%, hsla(210, 60%, 80%, .02) 0, hsla(210, 50%, 75%, .01) 80%, transparent 100%)',
        }}
        className="absolute top-0 left-0"
      />
    </div>
  );
};
