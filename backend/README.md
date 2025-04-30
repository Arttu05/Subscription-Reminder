# BACKEND

## /AUTH

### /register

method: POST

Route where new users can be created. Takes username and password as a argument in body. Returns status 200 if register is successful.

### /login

method: POST

Login to account, with password and username in request's body. Returns status 200 and json with jwt token in ```accessToken``` key.

## /api

All routes in ```/api``` use ```ValidateToken``` middleware, that validates user's jwt token in request's header. Header should look like the following example: 
```Authorization: Bearer {token}```. 
This middleware also adds the user's ```_id``` from jwt token to ```req.user_id```, that most routes use.

```CheckUser``` middleware, checks if the user making requests has access to the subscription given in routes ```:id``` param. Routes that have ```:id``` param, use this middleware. 

### /subscriptions

method: GET

Returns status 200 and list of user's all subscriptions in json.

### /add

method: POST 

Used to add new subscription to user. requests body contains: 

```title``` String, 

```message``` String, 

```remind_date``` Number(unixtimestamp in milliseconds), 

```delete_after``` Boolean, 

```remind_again``` Boolean.

Returns status 200 if successful.


### /notification

method: POST

Adds notification to the notification database, that is used to send notifications.

requests body contains:

```push``` the value of  ```register.pushManager.subscribe({...})```, 

```sub_id``` id of the subscription,

```remind_date``` unixtimestamp(in milliseconds).

Returns status 200 on success.

### /notification/:id

method: DELETE

Middleware: ```Checkuser()```

Deletes notification from database using **subscription** id. Uses subscription id since subscription can only have one notification and middleware is also depended on it.

```:id``` is subscription's ```_id```.

Returns status 200 on success.

### /:id

method: GET

Middleware: ```Checkuser()```

Returns subscription using ```:id``` from param.

```:id``` is subscription's ```_id```.


Returns status 200 on success and the subscription with ```subscription``` key in json.

### /edit/:id

method: POST

Middleware: ```Checkuser()```

Updates the subscription with ```:id``` param as ```_id```.

Requests body contains the following values:

```title``` String,

```message``` String,

```remind_date``` Number,

```delete_after``` Boolean,

```remind_again``` Boolean,

And these are the values that will be updated.

return status 200 if successful.

### /:id

method: DELETE

Middleware: ```Checkuser()```

Deletes user with by id using ```:id``` param. 

returns status 200 