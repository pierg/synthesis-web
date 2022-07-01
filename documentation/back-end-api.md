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

### `"get-synthesis"`
#### Get all the synthesis created by the user and the examples
* accepts :
  * None
* returns :
  * [return example](./jsons-examples/example-receive-synthesis.json)
* returns-via: `"receive-synthesis"`

### `"delete-synthesis"`
#### Delete the save of a synthesis
* accepts :
  * [accept example](./jsons-examples/example-controller-information.json)
* returns :
  * A boolean
* returns-via: `"synthesis-deleted"`

## Signal for the simulation

### `"get-inputs"`
#### Get all the possible input for the current state
* accepts :
  * [accept example](./jsons-examples/example-controller-information.json)
* returns :
  * A list of the possible inputs 
* returns-via: `""`

### `"create-controller"`
#### Create or resume a controller. It returns the mealy of this controller
* accepts :
  * [accept example](./jsons-examples/example-controller-information.json)
* returns :
  * [return example](./jsons-examples/example-controller-created.json)
* returns-via: `"controller-created"`

### `"simulate-controller"`
#### Simulate the controller with the input chose by the user
* accepts :
  * [accept example](./jsons-examples/example-controller-information.json) plus the input chosen by the user
* returns :
  * The line to be display on the page 
* returns-via: `"controller-simulated"`

### `"reset-controller"`
#### Reset the current controller
* accepts :
  * [accept example](./jsons-examples/example-controller-information.json)
* returns :
  * A boolean
* returns-via: `"reset-done"`

### `"random-simulation-controller"`
#### Choose inputs randomly for x iterations
* accepts :
  * [accept example](./jsons-examples/example-controller-information.json) plus the number of iterations
* returns :
  * The x line to be display on the page
* returns-via: `"receive-random-simulation-controller"`
