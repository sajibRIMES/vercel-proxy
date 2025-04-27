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


// File: utils/getTransboundaryRiverDataTimely.js

export async function getTransboundaryRiverDataTimely(
    stationCode = "023-LBDJPG",
    startDate = "2025-04-24",
    endDate = "2025-04-27"
  ) {
    // Base URL for the API
    const baseUrl = "https://ffs.india-water.gov.in/iam/api/new-entry-data/specification/sorted";
  
    // Calculate current hour adjusted by +6 hours (mimicking Django's logic)
    const dateToday = new Date();
    dateToday.setHours(dateToday.getHours() + 6);
    const currentHour = dateToday.getHours().toString().padStart(2, "0");
  
    // Format dates for API
    const formattedStartDate = `${startDate}T00:00:00.000`;
    const formattedEndDate = `${endDate}T${currentHour}:00:00.000`;
  
    // Filtering criteria (same as Django view)
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
  
    // Sorting criteria
    const sortCriteria = {
      sortOrderDtos: [
        {
          sortDirection: "ASC",
          field: "id.dataTime",
        },
   shotgun
      ],
    };
  
    // Construct query parameters
    const queryParams = new URLSearchParams({
      "sort-criteria": JSON.stringify(sortCriteria),
      specification: JSON.stringify(specification),
    });
  
    // Final URL
    const finalUrl = `${baseUrl}?${queryParams.toString()}`;
  
    try {
      // Fetch data
      const res = await fetch(finalUrl, {
        cache: "no-store", // Disable caching
      });
  
      // Check response
      if (!res.ok) {
        throw new Error("Failed to fetch transboundary river data");
      }
  
      // Parse JSON response
      const data = await res.json();
  
      // Process response to match Django view's output
      const valueDict = {};
      let dataDate = null;
      const dataDict = {};
  
      if (data.length > 0) {
        // Get date from first record
        dataDate = new Date(data[0].id.dataTime).toISOString().split("T")[0];
  
        // Map hours to values (exclude last record as per Django logic)
        for (const item of data.slice(0, -1)) {
          const dt = new Date(item.id.dataTime);
          const hour = dt.getHours();
          valueDict[hour] = item.dataValue;
        }
  
        // Structure output
        dataDict[dataDate] = valueDict;
      }
  
      return dataDict;
    } catch (error) {
      console.error("Error fetching transboundary river data:", error);
      throw error;
    }
  }