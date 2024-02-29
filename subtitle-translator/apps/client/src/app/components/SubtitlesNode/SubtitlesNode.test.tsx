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

  it('downloads the file if subtitle is Addic7ed', async () => {
    server.use(
      http.get('http://192.168.1.106:3333/api/files/:uuid/subtitles', () => {
        return HttpResponse.json<Subtitles>([
          {
            referer: '/a/b',
            origin: 'Addic7ed',
            uuid: '1',
            name: 'a',
            link: '/abc.html',
            language: 'fr',
          },
        ]);
      }),
    );

    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitlesNode uuid="1" />
      </QueryClientProvider>,
    );

    const spy = vi.spyOn(axios, 'post');

    await userEvent.click(await screen.findByText(/addic7ed/i));

    expect(spy).toHaveBeenCalledWith(
      'http://192.168.1.106:3333/api/subtitles/download',
      {
        link: '/abc.html',
        referer: '/a/b',
        uuid: '1',
        language: "fr"
      },
    );
  });
  it('translates the file if subtitle is Internal', async () => {
    server.use(
      http.get('http://192.168.1.106:3333/api/files/:uuid/subtitles', () => {
        return HttpResponse.json<Subtitles>([
          {
            origin: 'Internal',
            uuid: '1',
            number: 3,
            name: 'a',
            language: 'en',
          },
        ]);
      }),
    );

    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitlesNode uuid="1" />
      </QueryClientProvider>,
    );

    const spy = vi.spyOn(axios, 'post');

    await userEvent.click(await screen.findByText(/internal/i));

    expect(spy).toHaveBeenCalledWith(
      'http://192.168.1.106:3333/api/subtitles/translate',
      {
        number: 3,
        uuid: '1',
      },
    );
  });
  it('does nothing if subtitle is External', async () => {
    server.use(
      http.get('http://192.168.1.106:3333/api/files/:uuid/subtitles', () => {
        return HttpResponse.json<Subtitles>([
          {
            origin: 'External',
            uuid: '1',
            name: 'a',
            language: 'en',
          },
        ]);
      }),
    );

    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitlesNode uuid="1" />
      </QueryClientProvider>,
    );

    const spy = vi.spyOn(axios, 'post');

    await userEvent.click(await screen.findByText(/external/i));

    expect(spy).not.toHaveBeenCalled();
  });
});
