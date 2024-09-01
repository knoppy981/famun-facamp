import _ from "lodash"

export function credentialsAoa(users: { name: string, presenceControl: { dailyCheckIn: string[] } | null }[]): (string | string[])[][] {
  // Step 1: Create a Set to store unique dates
  const uniqueDates = new Set<string>();

  // Step 2: Create a Map to store user-wise and date-wise time and text entries
  const userDateMap = new Map<string, Map<string, string>>();

  // Step 3: Iterate over the input array and process each user's dailyCheckIn
  users.forEach(user => {
    const userMap = new Map<string, string>();

    user.presenceControl?.dailyCheckIn.forEach(data => {
      const [date, time, text] = data.split(',').map(item => item.trim());

      // Add the date to the Set of unique dates
      uniqueDates.add(date);

      // Add the time and text to the userMap, concatenating if there are multiple entries
      if (userMap.has(date)) {
        // Concatenate with existing entry using "//"
        userMap.set(date, userMap.get(date)! + " // " + `${time}, ${text}`);
      } else {
        // Initialize with the first entry
        userMap.set(date, `${time}, ${text}`);
      }
    });

    // Store the userMap in the userDateMap with the user's name as the key
    userDateMap.set(user.name, userMap);
  });

  // Step 4: Sort the unique dates
  const sortedDates = Array.from(uniqueDates).sort();

  // Step 5: Create the result array with the header row
  const result: (string | string[])[][] = [];

  // First row with column names: first column is "Name", rest are sorted unique dates
  const headerRow = ["Name", ...sortedDates];
  result.push(headerRow);

  // Step 6: Add rows for each user with their name and check-in details
  users.forEach(user => {
    const userRow: (string | string[])[] = [user.name];

    sortedDates.forEach(date => {
      const entry = userDateMap.get(user.name)?.get(date);
      if (entry) {
        userRow.push(entry);
      } else {
        userRow.push(''); // Empty string if no entry for that date
      }
    });

    result.push(userRow);
  });

  return result;
}