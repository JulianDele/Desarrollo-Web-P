import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { describe, it, vi, expect } from 'vitest'

function Button({ onClick }) {
  return <button onClick={onClick}>Click me</button>
}

describe('Button interactions', () => {
  it('activates on Enter key', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} />)

    const button = screen.getByRole('button')
    button.focus()

    await userEvent.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
