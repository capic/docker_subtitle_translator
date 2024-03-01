import { describe, expect } from 'vitest';
import {
  Addic7edSubtitle,
  ExternalSubtitle,
  InternalSubtitle,
} from '@subtitle-translator/shared';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { userEvent } from '@storybook/testing-library';
import SubtitleNode from './SubtitleNode';

describe('SubtitleNode', () => {
  it.todo('renders the component');
  it('downloads the file if subtitle is Addic7ed', async () => {
    const subtitle: Addic7edSubtitle = {
      referer: '/a/b',
      origin: 'Addic7ed',
      uuid: '1',
      name: 'a',
      link: '/abc.html',
      language: 'fr',
    };

    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleNode subtitle={subtitle} />
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
        language: 'fr',
      },
    );
  });
  it('translates the file if subtitle is Internal', async () => {
    const subtitle: InternalSubtitle = {
      number: 3,
      language: undefined,
      type: 'utf8',
      name: 'SDH',
      uuid: '1',
      origin: 'Internal',
    };

    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleNode subtitle={subtitle} />
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
    const subtitle: ExternalSubtitle = {
      origin: 'External',
      uuid: '1',
      name: 'a',
      language: 'en',
    };

    render(
      <QueryClientProvider client={new QueryClient()}>
        <SubtitleNode subtitle={subtitle} />
      </QueryClientProvider>,
    );

    const spy = vi.spyOn(axios, 'post');

    await userEvent.click(await screen.findByText(/external/i));

    expect(spy).not.toHaveBeenCalled();
  });
});
