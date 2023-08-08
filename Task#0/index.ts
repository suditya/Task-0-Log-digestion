import * as fs from "fs";

// Defining the log file names
const fileNames = [
  "api-dev-out.log",
  "api-prod-out.log",
  "prod-api-prod-out.log",
];

// Initializing data structures to store counts
const endpointCount = new Map<string, number>();
const minuteCount = new Map<string, number>();
const statusCodeCount = new Map<number, number>();

// Function to process a single line of log data
function processLogLine(line: string) {
  // Split the line into parts
  const parts = line.split(" ");

  // Matching the endpoint using regex
  const endpointMatch = line.match(/"GET|POST (.+?)\s/);
  let endpoint = endpointMatch ? endpointMatch[1] : "Unknown";

  // Cleaning  the endpoint by replacing unwanted parts
  if (endpoint !== undefined && endpoint !== "Unknown") {
    endpoint = endpoint
      .replace(
        /\?.*|\/[a-fA-F0-9]{24}|\/(null|undefined)\/|\/\d+(?=[/\\?]|$)|\/+/g,
        "/"
      )
      .replace(/\/+/g, "/")
      .replace(/\/$/, "");
  }

  // Matching the status code using regex
  const statusCodeMatch = line.match(/HTTP\/1\.1" (\d{3})/);
  const statusCode = statusCodeMatch ? parseInt(statusCodeMatch[1]) : -1;

  // Updating endpoint count
  if (endpoint != "Unknown" && endpoint != undefined) {
    endpointCount.set(endpoint, (endpointCount.get(endpoint) || 0) + 1);
    // Updating API calls per minute
    const timestamp = parts.slice(0, 2).join(" ");
    const minute = timestamp.split(" ")[1];
    minuteCount.set(minute, (minuteCount.get(minute) || 0) + 1);
  }

  // Updating HTTP status code count
  if (statusCode !== -1) {
    statusCodeCount.set(statusCode, (statusCodeCount.get(statusCode) || 0) + 1);
  }
}

// Function to read and process data from files
function readDataFromFiles() {
  for (const fileName of fileNames) {
    const data = fs.readFileSync(fileName, "utf-8");
    const lines = data.split("\n");
    lines.forEach(processLogLine);
  }

  // Sorting minutes in ascending order
  const sortedMinutes = [...minuteCount.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  // Display results
  console.log("Endpoint Counts:");
  console.table(
    [...endpointCount.entries()].map(([endpoint, count]) => ({
      endpoint,
      count,
    }))
  );

  console.log("API Calls Per HTTP Status Code:");
  console.table(
    [...statusCodeCount.entries()].map(([statusCode, count]) => ({
      statusCode,
      count,
    }))
  );

  console.log("API Calls Per Minute:");
  console.table(
    sortedMinutes.map(([minute, count]) => ({
      minute,
      count,
    }))
  );

  
}

// Entry point
readDataFromFiles();
