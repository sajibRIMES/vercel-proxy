// Function to get the local date
export function getLocalDate(date) {
    const offset = new Date().getTimezoneOffset() * 60000;
    return new Date(date - offset).toISOString().slice(0, 23);
}

export function getFormattedDate(date) {
    // Create a new Date object from the input date
    const inputDate = new Date(date);

    // Add 6 hours to the input date
    inputDate.setHours(inputDate.getHours() + 6);

    // Convert the modified date to an ISO string and slice it to get the desired format
    return inputDate.toISOString().slice(0, 23);
}