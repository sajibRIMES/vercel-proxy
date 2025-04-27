import { NextResponse } from 'next/server';

// Helper function to encode URL components
const encodeQueryComponent = (obj) => {
    return encodeURIComponent(JSON.stringify(obj));
};

export async function GET(request) {
    try {
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const station_code = searchParams.get('station_code') || '005-LBDJPG';

        // Default date range: yesterday to today
        const dateYesterday = new Date();
        dateYesterday.setDate(dateYesterday.getDate() - 1);
        const defaultStartDate = dateYesterday.toISOString().split('T')[0] + 'T00:00:00.000';

        const dateToday = new Date();
        const defaultEndDate = dateToday.toISOString().split('T')[0] + 'T00:00:00.000';

        const start_date = searchParams.get('start_date') || defaultStartDate;
        const end_date = searchParams.get('end_date') || defaultEndDate;

        // Construct the API URL
        const baseUrl = 'https://ffs.india-water.gov.in/iam/api/new-entry-data/specification/sorted?sort-criteria=';
        const sortCriteria = encodeQueryComponent({
            sortOrderDtos: [
                {
                    sortDirection: 'ASC',
                    field: 'id.dataTime'
                }
            ]
        });

        const specification = encodeQueryComponent({
            where: {
                where: {
                    where: {
                        expression: {
                            valueIsRelationField: false,
                            fieldName: 'id.stationCode',
                            operator: 'eq',
                            value: station_code
                        }
                    },
                    and: {
                        expression: {
                            valueIsRelationField: false,
                            fieldName: 'id.datatypeCode',
                            operator: 'eq',
                            value: 'HHS'
                        }
                    }
                },
                and: {
                    expression: {
                        valueIsRelationField: false,
                        fieldName: 'dataValue',
                        operator: 'null',
                        value: 'false'
                    }
                },
                and: {
                    expression: {
                        valueIsRelationField: false,
                        fieldName: 'id.dataTime',
                        operator: 'btn',
                        value: `${end_date},${start_date}`
                    }
                }
            }
        });

        const url = `${baseUrl}${sortCriteria}&specification=${specification}`;

        // Fetch data from the external API
        const response = await fetch(url, { cache: 'no-store' });

        if (!response.ok) {
            return NextResponse.json(
                { error: `HTTP error: ${response.status} - ${response.statusText}` },
                { status: response.status }
            );
        }

        const jsonData = await response.json();

        return NextResponse.json(jsonData, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error: `Server error: ${error.message}` },
            { status: 500 }
        );
    }
}