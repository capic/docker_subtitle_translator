import { render, screen } from '@testing-library/react';
import SubtitleText from '.';
import React from 'react';

describe('SubtitleText', () => {
  it('renders the component', () => {
    render(
      <SubtitleText
        subtitle={{ language: 'fr', number: 1, type: 'utf' }}
        isLoading={false}
      />
    );

    expect(screen.getByText(/fr/)).toBeInTheDocument();
  });

  it('renders the subtitle name if exists', () => {
    render(
        <SubtitleText
          subtitle={{ language: 'fr', number: 1, type: 'utf', name: 'the name' }}
          isLoading={false}
        />
      );
  
      expect(screen.getByText(/fr - the name/)).toBeInTheDocument();
  })

  it('renders the loading', () => {
    render(
        <SubtitleText
          subtitle={{ language: 'fr', number: 1, type: 'utf', name: 'the name' }}
          isLoading={true}
        />
      );
  
      expect(screen.getByRole('progressbar')).toHaveClass('icon-loading')
  })
});
