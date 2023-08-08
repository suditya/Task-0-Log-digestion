# Log Analysis Tool

A Node.js script to analyze log files and extract useful insights about API calls.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Sample Output](#sample-output)

## Description

This tool reads log files containing API call information, processes the data, and provides insights about the number of API calls, status codes, and calls per minute.

## Features

- Counts the number of API calls per endpoint.
- Analyzes API calls per minute.
- Displays statistics on API calls per HTTP status code.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/log-analysis-tool.git
cd log-analysis-tool

```

2. Install dependencies:

```bash
 npm install

```

3. Usage
   Place your log files in the same directory as the script. Update the fileNames array in index.ts with your file names.

Run the script:

```bash
 npm start

```

The tool will process the log files and display statistics.

Sample Output

```bash

    Endpoint Counts:
    +-----------------------------+-------+
    |       endpoint              | count |
    +-----------------------------+-------+
    |   /api/auth/login           |  582  |
    |   /api/messages/search/chat |  79   |
    |   /api/auth/register        |  538  |
    ...

    API Calls Per Minute:
    +---------+-------+
    |  minute | count |
    +---------+-------+
    | 00:00   |  102  |
    | 00:01   |  98   |
    ...

    API Calls Per HTTP Status Code:
    +------------+-------+
    | statusCode | count |
    +------------+-------+
    |    200     | 160059|
    |    304     | 144418|
    |    404     | 97279 |
    ...
```
