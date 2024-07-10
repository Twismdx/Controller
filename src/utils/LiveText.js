import React, { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
// import './LiveText.css';

const LiveText = ({ liveStatus }) => {
  const [styles, api] = useSpring(() => ({ opacity: 0 }));

  useEffect(() => {
    if (liveStatus) {
      api.start({
        to: async (next) => {
          while (1) {
            await next({ opacity: 1, config: { duration: 2000 } });
            await next({ opacity: 0, config: { duration: 2000 } });
          }
        },
        from: { opacity: 0 },
        reset: true,
      });
    } else {
      api.stop();
      api.set({ opacity: 0 });
    }
  }, [liveStatus, api]);

  const styleMe = {
    live: {
      fontSize: 36
    }
  
  }

  return (
    <div className="container">
      {liveStatus && (
        <animated.div style={styles} className="live">
          <text>
          Live
          </text>
        </animated.div>
      )}
    </div>
  );
};

export default LiveText;
