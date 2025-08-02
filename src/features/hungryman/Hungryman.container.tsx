'use client';

import React from 'react';
import { useHungryman } from './Hungryman.use';
import { HungrymanPresentation } from './Hungryman.presentational';

export const HungrymanContainer: React.FC = () => {
  const props = useHungryman();
  return (
    <HungrymanPresentation {...props} />
  );
};