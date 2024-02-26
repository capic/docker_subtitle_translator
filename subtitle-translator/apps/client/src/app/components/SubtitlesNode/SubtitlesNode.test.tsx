import { describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SubtitlesNode from './SubtitlesNode';
import { userEvent } from '@storybook/testing-library';
import axios from 'axios';

describe('SubtitlesNode', () => {
  it('renders the node', () => {
    render(<SubtitlesNode uuid="1" />)

    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('downloads the file if subtitle is Addic7ed', async () => {
    render(<SubtitlesNode uuid="1" />)

    const spy = vi.spyOn(axios, 'post')

    await userEvent.click(screen.getByRole('listitem'))

    expect(spy).toHaveBeenCalledWith('')
  })
  it.todo('translates the file if subtitle is Internal')
  it.todo('does nothing if subtitle is External')
})
