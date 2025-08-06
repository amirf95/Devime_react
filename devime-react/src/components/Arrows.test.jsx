// SurveyNavigator.test.jsx
/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NavigationArrows from './NavigationArrows';
import '@testing-library/jest-dom/extend-expect';
import { describe, it, expect } from '@jest/globals';

describe('NavigationArrows', () => {
  it('disables the Previous button on the first step', () => {
    render(
      <MemoryRouter initialEntries={['/estimation-tache0']}>
        <Routes>
          <Route path="/estimation-tache0" element={<NavigationArrows />} />
        </Routes>
      </MemoryRouter>
    );

    const previousButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');

    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
  });

it('disables the Next button on the last step', () => {
    render(
      <MemoryRouter initialEntries={['/estimation-tache2']}>
        <Routes>
          <Route path="/estimation-tache2" element={<NavigationArrows />} />
        </Routes>
      </MemoryRouter>
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });
});
