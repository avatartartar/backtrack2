import { render, screen } from '@testing-library/react';
import SqlParentComp from './SqlParentComp';

describe('SqlParentComp', () => {
  test('renders without errors', () => {
    render(<SqlParentComp />);
    // Assert that the component renders without throwing any errors
  });

  test('renders ImportComp', () => {
    render(<SqlParentComp />);
    expect(screen.getByTestId('import-comp')).toBeInTheDocument();
    // Assert that the ImportComp component is rendered
  });

  test('renders SqlLoadComp', () => {
    render(<SqlParentComp />);
    expect(screen.getByTestId('sql-load-comp')).toBeInTheDocument();
    // Assert that the SqlLoadComp component is rendered
  });

  test('renders SqlResultsComp', () => {
    render(<SqlParentComp />);
    expect(screen.getByTestId('sql-results-comp')).toBeInTheDocument();
    // Assert that the SqlResultsComp component is rendered
  });
});
