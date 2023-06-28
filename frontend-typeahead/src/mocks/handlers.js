import { rest } from 'msw';

const handlers = [
    rest.get('https://api.themoviedb.org/3/search/movie', (req, res, ctx) => {
        const data = {
            results: [
                { id: 1, title: 'Movie 1' },
                { id: 2, title: 'Movie 2' },
                { id: 3, title: 'Movie 3' },
            ],
        };

        return res(ctx.json(data));
    }),
];

export default handlers;