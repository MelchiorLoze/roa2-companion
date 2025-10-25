import { render, screen } from '@testing-library/react-native';

import { StatRow } from './StatRow';

describe('StatRow', () => {
  it('renders correctly', () => {
    render(<StatRow label="Test Label" value="Test Value" />);

    screen.getByText('Test Label');
    screen.getByText('Test Value');
  });
});
