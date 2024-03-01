import type { Meta, StoryObj } from '@storybook/react';
import { handlers } from '../../../mocks/handlers';

import SubtitlesNode from './SubtitlesNode';
import React from 'react';
import { userEvent, within } from '@storybook/testing-library';
import { delay, http, HttpResponse } from 'msw';

const meta: Meta<typeof SubtitlesNode> = {
  component: SubtitlesNode,
};

export default meta;

type Story = StoryObj<typeof SubtitlesNode>;

export const Multiple: Story = {
  render: () => <SubtitlesNode uuid="1" />,
  parameters: {
    msw: handlers,
  },
};

export const MultipleWithInProgress: Story = {
  render: () => <SubtitlesNode uuid="1" />,
  parameters: {
    msw: [
      ...handlers,
      http.post('http://192.168.1.106:3333/api/subtitles/translate', async() => {
        await delay(1000000)

        return HttpResponse.json('')
      }),
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText(/Internal -default/i));
  },
};
