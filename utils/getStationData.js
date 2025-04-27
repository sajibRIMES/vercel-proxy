import { getLocalDate, getFormattedDate } from "@/utils/helpers";

export async function getStationData(stationCode = '023-LBDJPG') {
    const baseUrl = 'https://ffs.india-water.gov.in/iam/api/new-entry-data/specification/sorted';
    const sortCriteria = {
        sortOrderDtos: [
            {
                sortDirection: 'ASC',
                field: 'id.dataTime'
            }
        ]
    };

    const startDate = new Date().setDate(new Date().getDate() - 3);
    const endDate = new Date();
    const formattedStartDate = getFormattedDate(startDate);
    const formattedEndDate = getFormattedDate(endDate);

    const specification = {
        where: {
            where: {
                where: {
                    expression: {
                        valueIsRelationField: false,
                        fieldName: 'id.stationCode',
                        operator: 'eq',
                        value: stationCode
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
                    value: `${formattedStartDate},${formattedEndDate}`
                }
            }
        }
    };

    const queryParams = new URLSearchParams({
        'sort-criteria': JSON.stringify(sortCriteria),
        'specification': JSON.stringify(specification)
    });

    const finalUrl = `${baseUrl}?${queryParams.toString()}`;

    try {
        console.log("getStationData - Fetching from URL:", finalUrl);
        const res = await fetch(finalUrl, {
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error(`getStationData - Fetch failed with status: ${res.status}, statusText: ${res.statusText}`);
            throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log("getStationData - API response:", data);
        return data;
    } catch (error) {
        console.error("getStationData - Error:", error.message);
        throw error;
    }
}

export async function getTransboundaryRiverDataTimely(
    stationCode = "023-LBDJPG",
    startDate = "2025-04-24",
    endDate = "2025-04-27"
) {
    const baseUrl = "https://ffs.india-water.gov.in/iam/api/new-entry-data/specification/sorted";
    const startDateObj = new Date(startDate);
    startDateObj.setHours(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds());
    const formattedStartDate = getFormattedDate(startDateObj);

    const endDateObj = new Date(endDate);
    endDateObj.setHours(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds());
    const formattedEndDate = getFormattedDate(endDateObj);

    const specification = {
        where: {
            where: {
                where: {
                    expression: {
                        valueIsRelationField: false,
                        fieldName: "id.stationCode",
                        operator: "eq",
                        value: stationCode,
                    },
                },
                and: {
                    expression: {
                        valueIsRelationField: false,
                        fieldName: "id.datatypeCode",
                        operator: "eq",
                        value: "HHS",
                    },
                },
            },
            and: {
                expression: {
                    valueIsRelationField: false,
                    fieldName: "dataValue",
                    operator: "null",
                    value: "false",
                },
            },
            and: {
                expression: {
                    valueIsRelationField: false,
                    fieldName: "id.dataTime",
                    operator: "btn",
                    value: `${formattedStartDate},${formattedEndDate}`,
                },
            },
        },
    };

    const sortCriteria = {
        sortOrderDtos: [
            {
                sortDirection: "ASC",
                field: "id.dataTime",
            },
        ],
    };

    const queryParams = new URLSearchParams({
        "sort-criteria": JSON.stringify(sortCriteria),
        specification: JSON.stringify(specification),
    });

    const finalUrl = `${baseUrl}?${queryParams.toString()}`;

    try {
        console.log("getTransboundaryRiverDataTimely - Fetching from URL:", finalUrl);
        const res = await fetch(finalUrl, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error(`getTransboundaryRiverDataTimely - Fetch failed with status: ${res.status}, statusText: ${res.statusText}`);
            throw new Error(`Failed to fetch transboundary river data: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log("getTransboundaryRiverDataTimely - API response:", data);

        const dataDict = {};
        if (data.length > 0) {
            for (const item of data.slice(0, -1)) {
                const dt = new Date(item.id.dataTime);
                const date = dt.toISOString().split("T")[0];
                const hour = dt.getHours();
                if (!dataDict[date]) {
                    dataDict[date] = {};
                }
                dataDict[date][hour] = item.dataValue;
            }
        } else {
            console.log(`getTransboundaryRiverDataTimely - No data found for station ${stationCode} between ${startDate} and ${endDate}`);
        }

        return dataDict;
    } catch (error) {
        console.error("getTransboundaryRiverDataTimely - Error:", error.message);
        throw error;
    }
}