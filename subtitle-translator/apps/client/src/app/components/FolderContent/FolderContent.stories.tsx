import type { Meta, StoryObj } from '@storybook/react';
import { handlers } from '../../../mocks/handlers'

import FolderContent from '.';
import React from 'react';

const meta: Meta<typeof FolderContent> = {
  component: FolderContent,
};

export default meta;

type Story = StoryObj<typeof FolderContent>;

export const Multiple: Story = {
    render: () => <FolderContent uuid='1' />,
    parameters: {
        msw: handlers
    }
}