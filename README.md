FORMAT: 1A
HOST: https://www.livingroomofsatoshi.com/api/v1

# Living Room of Satoshi API
Pay any Australian bill with bitcoin using our API.

**HTTP Basic Auth** is required for all API endpoints. Request an API username and password at support@livingroomofsatoshi.com

# Group BPAY Bills
Create a BPAY bill, which you can then pay with bitcoin.

Bitcoin Payment must be made within 5 minutes, otherwise the bill will expire.


## BPAY Bills [/bills/bpay]

### Create a BPAY Bill [POST]

+ Request (application/json)

        { 
          "amount":290.95, 
          "biller":"23796",
          "ref":"1000023451"
        }

+ Response 201 (application/json)

        {
          "id":1,
          "amount":123.45,
          "biller":"23796",
          "ref":"1000023451",
          "status":"UNPAID",
          "bitcoin_payment_address":"1AaxRWDPRbxXvYfFCjwNw4zQSf2tBXj9UA"
        }

+ Response 400 (application/json)
        
        [{"field":"biller","message":"Biller is unknown."}]


### List all BPAY Bills [GET]
+ Response 200 (application/json)

        [{
          "id": 1, "phrase": "The journalists drove carefully", "customerRef": "443556", "amount": "290.95", "dueDate": "20141030", "status": "UNPAID"
        }, {
          "id": 2, "phrase": "He played tennis yesterday", "customerRef": "443556", "amount": "290.95", "dueDate": "20141030", "status": "UNPAID" }

        }]

     
## BPAY Bill [/bills/bpay/{id}]

+ Parameters
    + id (required, number) ... Numeric `id` of the Bill

### Retrieve a single BPAY Bill [GET]
+ Response 200 (application/json)

    + Header

            X-My-Header: The Value

    + Body

            { "id": 1, "phrase": "The journalists drove carefully", "customerRef": "443556", "amount": "290.95", "dueDate": "20141030", "status": "UNPAID" }

# Group Rates
Bitcoin Exchange rates used for all calculations.

## Current Rate [/current_rate]
Updated every 30 seconds.

### Retrieve Current rate [GET]
+ Response 200 (application/json)

        {"amount":500.00,"currency":"AUD"}
