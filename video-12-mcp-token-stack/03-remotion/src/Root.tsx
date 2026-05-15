import React from 'react';
import {Composition} from 'remotion';
import {Main, VIDEO_DURATION_FRAMES} from './Main';

export const Root: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      durationInFrames={VIDEO_DURATION_FRAMES}
      fps={25}
      width={1920}
      height={1080}
    />
  );
};
