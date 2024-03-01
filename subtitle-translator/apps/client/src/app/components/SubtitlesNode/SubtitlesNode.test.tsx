import { describe, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SubtitlesNode from './SubtitlesNode';
import { userEvent } from '@storybook/testing-library';
import axios from 'axios';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { server } from '../../../mocks/node';
import { http, HttpResponse } from 'msw';
import { Subtitles } from '@subtitle-translator/shared';

describe('SubtitlesNode', () => {
  it('renders the node', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitlesNode uuid="1" />
      </QueryClientProvider>,
    );

    expect(await screen.findByRole('list')).toBeInTheDocument();
  });
});
