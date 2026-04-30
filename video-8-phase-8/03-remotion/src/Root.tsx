import React from 'react';
import { Composition } from 'remotion';
import { Main } from './Main';

// 798.082 seconds * 25 fps = 19952.05 → 19953 frames (round up)
const TOTAL_FRAMES = 19953;
const FPS = 25;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
