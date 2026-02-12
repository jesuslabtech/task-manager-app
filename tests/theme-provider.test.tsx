import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../components/theme-provider';
import '@testing-library/jest-dom';

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="next-themes-provider">{children}</div>
  ),
}));

describe('ThemeProvider Component', () => {
  it('should render children correctly', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div data-testid="test-child">Test Child</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should render the theme provider wrapper', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div>Content</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument();
  });

  it('should pass props to NextThemesProvider', () => {
    const { container } = render(
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        enableColorScheme={false}
      >
        <div>Themed Content</div>
      </ThemeProvider>,
    );

    // Verify that the component renders properly with props
    expect(
      container.querySelector('[data-testid="next-themes-provider"]'),
    ).toBeTruthy();
  });

  it('should support multiple children', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('should render with custom attributes', () => {
    render(
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="light"
        enableSystem={true}
      >
        <div>Custom Themed Content</div>
      </ThemeProvider>,
    );

    expect(screen.getByText('Custom Themed Content')).toBeInTheDocument();
  });

  it('should work as a wrapper component', () => {
    const TestComponent = () => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div data-testid="wrapped-content">Wrapped Content</div>
      </ThemeProvider>
    );

    render(<TestComponent />);

    expect(screen.getByTestId('wrapped-content')).toBeInTheDocument();
  });
});
