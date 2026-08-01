import { render, screen } from '@testing-library/react-native';

import { StatRow } from './StatRow';

describe('StatRow', () => {
  it('renders correctly with a string value', () => {
    render(<StatRow label="Test Label" value="Test Value" />);

    expect(screen.getByText('Test Label')).toBeTruthy();
    expect(screen.getByText('Test Value')).toBeTruthy();
  });

  it('renders correctly with a number value', () => {
    render(<StatRow label="Test Label" value={42} />);

    expect(screen.getByText('Test Label')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
  });
});
