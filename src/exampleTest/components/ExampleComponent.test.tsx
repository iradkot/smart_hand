// examples/components/ExampleComponent.test.tsx
import { render, fireEvent, screen } from '@testing-library/react';
import { ExampleComponent } from './ExampleComponent';

// Helper function to set up component for tests
const setup = (props = {}) => {
  render(<ExampleComponent {...props} />);
  const incrementButton = screen.getByTestId('increment-button');
  const decrementButton = screen.getByTestId('decrement-button');
  const countDisplay = screen.getByTestId('count-display');
  return { incrementButton, decrementButton, countDisplay };
};

describe('ExampleComponent', () => {

  describe('Initial Rendering', () => {
    test('renders with default initial count', () => {
      const { countDisplay, incrementButton, decrementButton } = setup();
      expect(countDisplay).toHaveTextContent('Count: 0'); // Default count
      expect(incrementButton).toBeEnabled();
      expect(decrementButton).toBeEnabled();
    });

    test.each`
      initialCount | expectedText
      ${0}         | ${'Count: 0'}
      ${5}         | ${'Count: 5'}
    `('renders correctly with initialCount=$initialCount', ({ initialCount, expectedText }) => {
      const { countDisplay } = setup({ initialCount });
      expect(countDisplay).toHaveTextContent(expectedText);
    });
  });

  describe('Button Interactions', () => {
    test('increments count when increment button is clicked', () => {
      const { incrementButton, countDisplay } = setup();
      fireEvent.click(incrementButton);
      expect(countDisplay).toHaveTextContent('Count: 1');
    });

    test('decrements count when decrement button is clicked', () => {
      const { decrementButton, countDisplay } = setup({ initialCount: 1 });
      fireEvent.click(decrementButton);
      expect(countDisplay).toHaveTextContent('Count: 0');
    });
  });

  describe('Disabled Buttons', () => {
    test('disables increment and decrement buttons when isDisabled prop is true', () => {
      const { incrementButton, decrementButton } = setup({ isDisabled: true });
      expect(incrementButton).toBeDisabled();
      expect(decrementButton).toBeDisabled();
    });
  });

  describe('Accessibility and ARIA', () => {
    test('increment button has accessible name', () => {
      const { incrementButton } = setup();
      expect(incrementButton).toHaveAccessibleName('Increment');
    });

    test('decrement button has accessible name', () => {
      const { decrementButton } = setup();
      expect(decrementButton).toHaveAccessibleName('Decrement');
    });
  });

  describe('Visual and Focus Tests', () => {
    test('count display is visible', () => {
      const { countDisplay } = setup();
      expect(countDisplay).toBeVisible();
    });

    test('increment button can receive focus', () => {
      const { incrementButton } = setup();
      incrementButton.focus();
      expect(incrementButton).toHaveFocus();
    });

    test('matches snapshot for visual consistency', () => {
      const { container } = render(<ExampleComponent />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Edge Cases', () => {
    test('handles negative initial count', () => {
      const { countDisplay } = setup({ initialCount: -5 });
      expect(countDisplay).toHaveTextContent('Count: -5');
    });

    test('renders with missing optional props', () => {
      const { countDisplay } = setup();
      expect(countDisplay).toHaveTextContent('Count: 0');
    });
  });

});
