"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var fs = require("fs");
// Defining the log file names
var fileNames = [
    "api-dev-out.log",
    "api-prod-out.log",
    "prod-api-prod-out.log",
];
// Initializing data structures to store counts
var endpointCount = new Map();
var minuteCount = new Map();
var statusCodeCount = new Map();
// Function to process a single line of log data
function processLogLine(line) {
    // Split the line into parts
    var parts = line.split(" ");
    // Matching the endpoint using regex
    var endpointMatch = line.match(/"GET|POST (.+?)\s/);
    var endpoint = endpointMatch ? endpointMatch[1] : "Unknown";
    // Cleaning  the endpoint by replacing unwanted parts
    if (endpoint !== undefined && endpoint !== "Unknown") {
        endpoint = endpoint
            .replace(/\?.*|\/[a-fA-F0-9]{24}|\/(null|undefined)\/|\/\d+(?=[/\\?]|$)|\/+/g, "/")
            .replace(/\/+/g, "/")
            .replace(/\/$/, "");
    }
    // Matching the status code using regex
    var statusCodeMatch = line.match(/HTTP\/1\.1" (\d{3})/);
    var statusCode = statusCodeMatch ? parseInt(statusCodeMatch[1]) : -1;
    // Updating endpoint count
    if (endpoint != "Unknown" && endpoint != undefined) {
        endpointCount.set(endpoint, (endpointCount.get(endpoint) || 0) + 1);
        // Updating API calls per minute
        var timestamp = parts.slice(0, 2).join(" ");
        var minute = timestamp.split(" ")[1];
        minuteCount.set(minute, (minuteCount.get(minute) || 0) + 1);
    }
    // Updating HTTP status code count
    if (statusCode !== -1) {
        statusCodeCount.set(statusCode, (statusCodeCount.get(statusCode) || 0) + 1);
    }
}
// Function to read and process data from files
function readDataFromFiles() {
    var e_1, _a;
    try {
        for (var fileNames_1 = __values(fileNames), fileNames_1_1 = fileNames_1.next(); !fileNames_1_1.done; fileNames_1_1 = fileNames_1.next()) {
            var fileName = fileNames_1_1.value;
            var data = fs.readFileSync(fileName, "utf-8");
            var lines = data.split("\n");
            lines.forEach(processLogLine);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (fileNames_1_1 && !fileNames_1_1.done && (_a = fileNames_1["return"])) _a.call(fileNames_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // Sorting minutes in ascending order
    var sortedMinutes = __spreadArray([], __read(minuteCount.entries()), false).sort(function (a, b) {
        return a[0].localeCompare(b[0]);
    });
    // Display results
    console.log("Endpoint Counts:");
    console.table(__spreadArray([], __read(endpointCount.entries()), false).map(function (_a) {
        var _b = __read(_a, 2), endpoint = _b[0], count = _b[1];
        return ({
            endpoint: endpoint,
            count: count
        });
    }));
    console.log("API Calls Per HTTP Status Code:");
    console.table(__spreadArray([], __read(statusCodeCount.entries()), false).map(function (_a) {
        var _b = __read(_a, 2), statusCode = _b[0], count = _b[1];
        return ({
            statusCode: statusCode,
            count: count
        });
    }));
    console.log("API Calls Per Minute:");
    console.table(sortedMinutes.map(function (_a) {
        var _b = __read(_a, 2), minute = _b[0], count = _b[1];
        return ({
            minute: minute,
            count: count
        });
    }));
}
// Entry point
readDataFromFiles();
