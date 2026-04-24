import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom'
import App from './App'

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    // Check if the logo/brand text is present, indicating the app has mounted
    expect(screen.getByText('CommitWork')).toBeInTheDocument()
  })
})
