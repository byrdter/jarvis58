import React from 'react';
import { Composition } from 'remotion';
import { ShotDemo, SHOT_DEMO_FRAMES } from './ShotDemo';
import { Main, VIDEO_11_FRAMES } from './Main';

const FPS = 25;
const WIDTH = 1920;
const HEIGHT = 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShotDemo"
        component={ShotDemo}
        durationInFrames={SHOT_DEMO_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Main"
        component={Main}
        durationInFrames={VIDEO_11_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
