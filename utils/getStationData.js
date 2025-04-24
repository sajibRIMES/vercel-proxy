// File: utils/getMikliGongStationData.js
import { getLocalDate, getFormattedDate } from "@/utils/helpers";

export async function getStationData(stationCode = '023-LBDJPG') {
    // Base url
    const baseUrl = 'https://ffs.india-water.gov.in/iam/api/new-entry-data/specification/sorted';

    // filtering process
    const sortCriteria = {
        sortOrderDtos: [
            {
                sortDirection: 'ASC',
                field: 'id.dataTime'
            }
        ]
    };

    const specification = {
        where: {
            where: {
                where: {
                    expression: {
                        valueIsRelationField: false,
                        fieldName: 'id.stationCode',
                        operator: 'eq',
                        value: stationCode // Now using the passed station code parameter
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
                    value: `${getFormattedDate(new Date().setDate(new Date().getDate() - 3))},${getFormattedDate(new Date())}` // start date, end date
                }
            }
        }
    };

    const queryParams = new URLSearchParams({
        'sort-criteria': JSON.stringify(sortCriteria),
        'specification': JSON.stringify(specification)
    });

    const finalUrl = `${baseUrl}?${queryParams.toString()}`;

    const res = await fetch(finalUrl, {
        cache: 'no-store' // Disable caching
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    return res.json();
}