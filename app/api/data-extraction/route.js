export async function GET(request) {
    const apiKey = request.headers.get('x-api-key');
    const expectedApiKey = process.env.PROXY_API_KEY;

    if (!apiKey || apiKey !== expectedApiKey) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'x-api-key'
            },
        });
    }

    const { searchParams } = new URL(request.url);
    const sortCriteria = searchParams.get('sort-criteria');
    const specification = searchParams.get('specification');
    const baseUrl = 'https://ffs.india-water.gov.in/iam/api/new-entry-data/specification/sorted';

    if (!sortCriteria || !specification) {
        return new Response(JSON.stringify({ error: 'Missing sort-criteria or specification' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'x-api-key'
            },
        });
    }

    const url = `${baseUrl}?sort-criteria=${sortCriteria}&specification=${specification}`;

    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'x-api-key'
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'x-api-key'
            },
        });
    }
}