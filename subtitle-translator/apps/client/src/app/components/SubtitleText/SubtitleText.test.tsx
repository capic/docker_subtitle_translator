import { render, screen } from '@testing-library/react';
import React from 'react';
import SubtitleText from './SubtitleText';

describe('SubtitleText', () => {
  it('renders the component', () => {
    render(
      <SubtitleText
        subtitle={{
          language: 'fr',
          number: 1,
          type: 'utf',
          origin: 'Internal',
        }}
        isLoading={false}
      />,
    );

    expect(screen.getByText(/fr/)).toBeInTheDocument();
  });

  it('renders the subtitle name if exists', () => {
    render(
      <SubtitleText
        subtitle={{
          language: 'fr',
          number: 1,
          type: 'utf',
          name: 'the name',
          origin: 'Internal',
        }}
        isLoading={false}
      />,
    );

    expect(screen.getByText(/fr - the name/)).toBeInTheDocument();
  });

  it('renders the loading', () => {
    render(
      <SubtitleText
        subtitle={{
          language: 'fr',
          number: 1,
          type: 'utf',
          name: 'the name',
          origin: 'Internal',
        }}
        isLoading={true}
      />,
    );

    expect(screen.getByRole('progressbar')).toHaveClass('icon-loading');
  });
});
