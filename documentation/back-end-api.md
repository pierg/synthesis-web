## Authentication signals

### `"connect"`
#### Establish the connection between the frontend and the backend
* accepts :
  * None
* returns :
  * None
* returns-via: `"is-connected"`

### `"session-existing"`
#### Check if a session is existing in output folder
* accepts : 
  * Name of the wanted session, example : `"session": "my_session_name"`
* returns :
  * Boolean to know is a session is available
* returns-via: `"receive-answer"`

### `"disconnect"`
#### Disconnect the user to its session
* accepts :
  * None
* returns :
  * None
* returns-via: None

## Signal for the synthesis page


## Signal for the simulation

### `"get-inputs"`
#### Get all the possible input for the current state
* accepts :
  * The name of the controller and the mode used
* returns :
  * A list of the possible inputs 
* returns-via: `""`

### `"simulate-controller"`
#### Simulate the controller with the input chose by the user
* accepts :
  * The name of the controller, the input and the mode used
* returns :
  * The line to be display on the page 
* returns-via: `"controller-simulated"`

### `"reset-controller"`
#### Reset the current controller
* accepts :
  * The name of the controller and the mode used
* returns :
  * A boolean
* returns-via: `"reset-done"`

### `"random-simulation-controller"`
#### Choose inputs randomly for x iterations
* accepts :
  * Name of the controller, the number of iterations and the mode used
* returns :
  * The x line to be display on the page
* returns-via: `"receive-random-simulation-controller"`
