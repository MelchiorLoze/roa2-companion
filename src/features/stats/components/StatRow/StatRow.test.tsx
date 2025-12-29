import { render, screen } from '@testing-library/react-native';

import { StatRow } from './StatRow';

describe('StatRow', () => {
  it('renders correctly', () => {
    render(<StatRow label="Test Label" value="Test Value" />);

    expect(screen.getByText('Test Label')).toBeTruthy();
    expect(screen.getByText('Test Value')).toBeTruthy();
  });
});
