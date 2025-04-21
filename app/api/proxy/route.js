export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const stationCode = searchParams.get('stationCode');
    const baseUrl = 'https://ffs.india-water.gov.in/iam/api/layer-station/';
    const url = `${baseUrl}${stationCode}`;

    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}