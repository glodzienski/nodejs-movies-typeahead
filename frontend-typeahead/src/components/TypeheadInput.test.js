import {render, fireEvent, waitFor} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import TypeaheadInput from "./TypeaheadInput";
import { server } from '../mocks/setup';

beforeAll(() => server.listen());
afterEach(() =>server.resetHandlers());
afterAll(() => server.close());

jest.mock('../utils/CacheManager', () => ({
    get: jest.fn(),
    store: jest.fn(),
}));

jest.mock('node-fetch', () => jest.fn());

describe('TypeaheadInput', () => {
    it('suggestions disappear when input loses focus', () => {
        const testSuggestions = ['suggestion1', 'suggestion2', 'suggestion3'];

        const {getByPlaceholderText, queryByTestId, getByTestId} = render(
            <TypeaheadInput suggestions={testSuggestions}/>
        );
        const input = getByPlaceholderText('Search');

        fireEvent.focus(input);

        const suggestionsListRendered = getByTestId('results-list');
        expect(suggestionsListRendered).toBeInTheDocument();

        fireEvent.blur(input);

        expect(queryByTestId('results-list')).toBeNull();

    });

    it('fetches and updates suggestions continuously when typing', async () => {
        const suggestionsData = {
            results: [
                { id: 1, title: 'Movie 1' },
                { id: 2, title: 'Movie 2' },
                { id: 3, title: 'Movie 3' },
            ],
        };

        const fetchMock = require('node-fetch');
        fetchMock.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(suggestionsData) });

        const { getByPlaceholderText, queryAllByTestId } = render(<TypeaheadInput />);

        const input = getByPlaceholderText('Search');

        fireEvent.change(input, { target: { value: 'test' } });

        await waitFor(() => {
            const suggestions = queryAllByTestId((id) => id.startsWith('suggestion-item-'));
            expect(suggestions.length).toBe(suggestionsData.results.length);
        });

        // Additional typing to trigger continuous fetching
        fireEvent.change(input, { target: { value: 'testing' } });

        await waitFor(() => {
            const suggestions = queryAllByTestId((id) => id.startsWith('suggestion-item-'));
            expect(suggestions.length).toBe(suggestionsData.results.length);
        });

        // Additional typing to trigger continuous fetching
        fireEvent.change(input, { target: { value: 'test123' } });

        await waitFor(() => {
            const suggestions = queryAllByTestId((id) => id.startsWith('suggestion-item-'));
            expect(suggestions.length).toBe(suggestionsData.results.length);
        });
    });

    it('highlights suggestion on mouseover', async () => {
        const suggestions = [
            { id: 1, title: 'Movie 1' },
            { id: 2, title: 'Movie 2' },
            { id: 3, title: 'Movie 3' },
        ];

        const { getByPlaceholderText, getByTestId } = render(<TypeaheadInput />);
        const input = getByPlaceholderText('Search');

        fireEvent.change(input, { target: { value: 'test' } });

        await waitFor(() => {
            suggestions.forEach((suggestion, index) => {
                const suggestionItem = getByTestId(`suggestion-item-${index + 1}`);

                fireEvent.mouseEnter(suggestionItem);

                expect(suggestionItem).toHaveClass('bg-blue-200');
            });
        }, 300)
    });
});