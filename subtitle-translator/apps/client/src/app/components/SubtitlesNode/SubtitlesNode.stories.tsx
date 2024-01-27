import type { Meta, StoryObj } from '@storybook/react';
import { handlers } from '../../../mocks/handlers'

import SubtitlesNode from '.';
import React from 'react';

const meta: Meta<typeof SubtitlesNode> = {
  component: SubtitlesNode,
};

export default meta;

type Story = StoryObj<typeof SubtitlesNode>;

export const Multiple: Story = {
    render: () => <SubtitlesNode uuid='1' />,
    parameters: {
        msw: handlers
    }
}