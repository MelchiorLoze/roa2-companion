import { render, screen } from '@testing-library/react-native';

import { Alert } from './Alert';

describe('Alert', () => {
  it('renders correctly', () => {
    render(<Alert text="Test Alert" />);

    expect(screen.getByText('Test Alert')).toBeTruthy();
  });
});
