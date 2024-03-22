import https from "https";

async function makeGetRequest(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, (res) => {
                let data = "";
                // one way to handle the response data using https and data event
                res.on("data", (chunk) => {
                    data += chunk;
                });
                // on end return the data
                res.on("end", () => {
                    resolve(JSON.parse(data));
                });
            })
            .on("error", (err) => {
                reject(err);
            });
    });
}

async function makePostRequest(url, data) {
    const postData = JSON.stringify(data);
    // split the given url to get the hostname and path
    const hostname = url.match(/https:\/\/([^/]+)/)[1];
    const path = url.match(/https:\/\/[^/]+(.+)/)[1];
    const options = {
        hostname: hostname,
        path: path,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": postData.length,
        },
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            // if different than ok reject the promise
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP status code ${res.statusCode}`));
                return;
            }
            // all good! resolve the promise
            resolve({ statusCode: res.statusCode, data: "" });
        });

        req.on("error", (error) => {
            reject(error);
        });
        // write the data to the request and end it, for good practice
        req.write(postData);
        req.end();
    });
}

async function main() {
    try {
        // Get task ID and transactions from the API
        console.log("Fetching task from: https://interview.adpeai.com/api/v2/get-task")
        const { id, transactions } = await makeGetRequest(
            "https://interview.adpeai.com/api/v2/get-task"
        );
        console.log("Task fetched successfully.")

        // Filter transactions from last year using the date from each transaction
        // and the current year, making a filter 
        const lastYearTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.timeStamp);
            const currentYear = new Date().getFullYear();
            return transactionDate.getFullYear() === currentYear - 1;
        });

        // Simple accumulator
        // create key/pair map of employeeID to total amount
        const employeeTotals = {};
        lastYearTransactions.forEach((transaction) => {
            const employeeID = transaction.employee.id;
            if (!employeeTotals[employeeID]) {
                employeeTotals[employeeID] = 0;
            }
            employeeTotals[employeeID] += transaction.amount;
        });

        // Find employee with highest sum total with this nice reduce function.
        // Reduce need an array to iterate over, so we use Object.keys to get the keys of the object
        // with the keys within the reduce function we can access the values of the object and compare them
        // with the neighboor value, if the current value is greater than the neighbor value we return the current value
        // so in the end we get the key of the employee with the highest total amount
        const topEarnerID = Object.keys(employeeTotals).reduce((a, b) =>
            employeeTotals[a] > employeeTotals[b] ? a : b
        );

        // Get transaction ids of the top earner with type 'alpha'
        const topEarnerTransactions = lastYearTransactions.filter((transaction) => {
            return (
                transaction.employee.id === topEarnerID && transaction.type === "alpha"
            );
        });
        // make a map of the transactionIDs
        const transactionIDs = topEarnerTransactions.map(
            (transaction) => transaction.transactionID
        );

        console.log("Top earner transaction IDs:", transactionIDs);
        console.log("Submitting task to: https://interview.adpeai.com/api/v2/submit-task")
        const response = await makePostRequest(
            "https://interview.adpeai.com/api/v2/submit-task",
            { id, result: transactionIDs }
        );
        // post response is ok!! 
        if (response.statusCode === 200) {
            console.log("Task submitted successfully.");
        } else {
            console.error("Error submitting task:", response.data);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// init process
main();
