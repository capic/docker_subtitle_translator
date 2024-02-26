import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import SubtitleText from './SubtitleText';

const meta: Meta<typeof SubtitleText> = {
  component: SubtitleText,
};

export default meta;

type Story = StoryObj<typeof SubtitleText>;

export const InternalBase: Story = {
  render: () => (
    <SubtitleText
      subtitle={{
        language: 'fr',
        number: 1,
        type: 'utf',
        origin: 'Internal',
        uuid: '1',
      }}
      isLoading={false}
    />
  ),
};

export const InternalWithName: Story = {
  render: () => (
    <SubtitleText
      subtitle={{
        language: 'fr',
        number: 1,
        type: 'utf',
        name: 'my name',
        origin: 'Internal',
        uuid: '1',
      }}
      isLoading={false}
    />
  ),
};

export const InternalWithLoading: Story = {
  render: () => (
    <SubtitleText
      subtitle={{
        language: 'fr',
        number: 1,
        type: 'utf',
        name: 'my name',
        origin: 'Internal',
        uuid: '1',
      }}
      isLoading={true}
    />
  ),
};

export const ExternalBase: Story = {
  render: () => (
    <SubtitleText
      subtitle={{
        language: 'fr',
        number: 1,
        type: 'utf',
        origin: 'External',
        uuid: '1',
      }}
      isLoading={false}
    />
  ),
};

export const ExternalWithName: Story = {
  render: () => (
    <SubtitleText
      subtitle={{
        language: 'fr',
        number: 1,
        type: 'utf',
        name: 'my name',
        origin: 'External',
        uuid: '1',
      }}
      isLoading={false}
    />
  ),
};

export const Addic7edBase: Story = {
  render: () => (
    <SubtitleText
      subtitle={{
        language: 'fr',
        number: 1,
        type: 'utf',
        origin: 'Addic7ed',
        uuid: '1',
      }}
      isLoading={false}
    />
  ),
};

export const Addic7edWithName: Story = {
  render: () => (
    <SubtitleText
      subtitle={{
        language: 'fr',
        number: 1,
        type: 'utf',
        name: 'my name',
        origin: 'Addic7ed',
        uuid: '1',
      }}
      isLoading={false}
    />
  ),
};

export const Addic7edWithLoading: Story = {
  render: () => (
    <SubtitleText
      subtitle={{
        language: 'fr',
        number: 1,
        type: 'utf',
        name: 'my name',
        origin: 'Addic7ed',
        uuid: '1',
      }}
      isLoading={true}
    />
  ),
};
