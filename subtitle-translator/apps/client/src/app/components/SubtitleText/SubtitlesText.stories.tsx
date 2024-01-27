import type { Meta, StoryObj } from '@storybook/react';
import { handlers } from '../../../mocks/handlers'

import SubtitleText from '.';
import React from 'react';

const meta: Meta<typeof SubtitleText> = {
  component: SubtitleText,
};

export default meta;

type Story = StoryObj<typeof SubtitleText>;

export const Base: Story = {
  render: () => <SubtitleText subtitle={{language: 'fr', number: 1, type: 'utf'}} isLoading={false} />
};

export const WithName: Story = {
  render: () => <SubtitleText subtitle={{language: 'fr', number: 1, type: 'utf', name: 'my name'}} isLoading={false} />
};

export const WithLoading: Story = {
  render: () => <SubtitleText subtitle={{language: 'fr', number: 1, type: 'utf', name: 'my name'}} isLoading={true} />
};