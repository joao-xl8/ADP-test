# ADP Innovation Labs Pre-Interview Assignment
Hello potential future coworker! :D

We're looking forward to having some great days working on creating new projects, debugging issues, planning applications, solving problems, and all of the other fun things we do here in Innovation Labs - together with you!

But before that, let's see if you can demonstrate some stock skills you'll need to be successful in this position :)

If anything isn't specifically called out here, feel free to be as inventive as you like - no pressure to adhere to any strict rules. Our primary goal is to know that you generally understand web application principles.

Have fun!

Task
Create a simple JavaScript (nodejs) application that makes an HTTP GET request to

https://interview.adpeai.com/api/v2/get-task

This endpoint will provide you with an id and an array of transactions data.

{
  "id":"81728ed3-25ff-473c-9491-4a2026dadd8c",
  "transactions": [
    // This will be an array of transactions
  ]
}
Each transaction object within the array has the following shape (details may be different):

  
{
  "transactionID": "TX_691",
  "timeStamp": "2021-05-25T17:35:19.460Z",
  "amount": 1060,
  "type": "alpha",
  "location": {
    "name": "New York, New York",
    "id": "L027145"
  },
  "employee": {
    "name": "Abram W Choi",
    "id": "SED133",
    "categoryCode": "red"
  }
}
With this data:

Get all the transactions of last year's top earner. This means find the employee with the highest sum total of amount within the prior calendar year. Prior calendar year means, if it is currently 2022, we want only to consider transactions in 2021.
With last year's top earner's transactions get the transactionIDs where the type is alpha.
Once you have an id and an array of transactionIDs (should be an array of strings), make an HTTP POST request to

https://interview.adpeai.com/api/v2/submit-task

with a JSON POST body including the properties id and result.

Body example:

{
  "id": "81728ed3-25ff-473c-9491-4a2026dadd8c",
  "result": ["TX_002", "TX_003"]
}
The submit-task endpoint will return as follows:

Status Code	Description
200	Success
400	Incorrect value in result; no ID specified; value is invalid
404	Value not found for specified ID
503	Error communicating with database
If you get 200, you are done!

Evaluation Criteria
the candidate should not use frameworks like React, Angular, and Express, or bootstraps like create-react-app and angular cli. Libraries are allowed, just not frameworks.
a reviewer should be able to clone this repository (e.g. from Github, Bitbucket)
a reviewer should be able to run npm install and get all required dependencies
a reviewer should be able to run npm start to run the application
a reviewer should be able to see that calls are successful
the work should be free of CORs errors when running on http://localhost
Code is commented where appropriate
Report any bugs or issues you find (there shouldn't be any, but who knows ;))
