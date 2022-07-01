import argparse
import threading
import time
from os import walk
from time import strftime
from typing import Any

from flask import Flask, Response, request
from flask_socketio import SocketIO, emit

from backend.operations.simulation import Simulation
from backend.operations.synthesis import Synthesis
from backend.shared.paths import (
    build_path,
    storage_path,
)

parser = argparse.ArgumentParser(description="Launching Flask Backend")
parser.add_argument(
    "--serve", default=False, type=bool, help="indicate if serving the pages"
)
args = parser.parse_args()

if args.serve:
    print("Serving the web pages from the build folder")
    app = Flask(__name__, static_folder=str(build_path), static_url_path="/")
else:
    print("Launching Backend")
    app = Flask(__name__)

socketio = SocketIO(app, cors_allowed_origins="*")

users: dict[str, Any] = {}
# String dictionary associating the id of the request to talk to the user with the session id given by the frontend.

cookies: dict[str, str] = {}

# String dictionary association the id of the session with that of the cookie that can open it.


@socketio.on("connect")
def connected() -> None:
    """
    Establish the connection between the front and the back
    while checking that the session is not already in use.
    """
    print("Connected")
    print(f'ID {request.args.get("id")}')
    lock = threading.Lock()
    lock.acquire()
    session_id = str(request.args.get("id"))
    cookie = str(request.args.get("cookie"))
    tab_id = str(request.args.get("tabId"))
    if session_id in users:  # Check if this session is already open
        if cookie != cookies[session_id]:
            emit(
                "is-connected",
                False,
                room=request.sid
            )
            return
    else:
        users[session_id] = {}
    users[session_id][tab_id] = request.sid
    cookies[session_id] = cookie
    now = time.localtime(time.time())
    emit(
        "send-message",
        strftime("%H:%M:%S", now) + f" Connected to session {request.args.get('id')}",
        room=request.sid
    )
    emit(
        "is-connected",
        True,
        room=request.sid
    )
    lock.release()


@socketio.on("session-existing")
def check_if_session_exist(data) -> None:
    """
    Check if a session is free and if the user can enter it.
    """
    session_id = str(data["session"])
    tab_id = str(request.args.get("tabId"))
    cookie = str(request.args.get("cookie"))
    print("check if following session exists : " + session_id)
    dir_path, dir_names, filenames = next(walk(storage_path))
    found = False
    sessions_folder = f"s_" + session_id
    for dir_name in dir_names:
        if dir_name == sessions_folder:
            found = True
    if session_id == "default" or session_id == "contracts":
        found = False

    if found:
        if session_id in users and cookie != cookies[session_id]:
            found = False
    print(f"users : {users}")
    emit("receive-answer", found, room=users[str(request.args.get("id"))][tab_id])


@socketio.on("disconnect")
def disconnected() -> None:
    """
    It disconnects the user of the session he was attached to.
    """
    print("Disconnected")
    print(request.args)
    print(f'ID {request.args.get("id")}')

    session_id = str(request.args.get("id"))
    tab_id = str(request.args.get("tabId"))

    if session_id in users and tab_id in users[session_id]:
        now = time.localtime(time.time())
        emit(
            "send-message",
            f"{strftime('%H:%M:%S', now)} Session {request.args.get('id')} disconnected",
            room=request.sid
        )
        del users[session_id][tab_id]


@app.route("/")
def index() -> Response:
    return app.send_static_file("index.html")


@app.route("/time")
def get_current_time() -> dict[str, float]:
    return {"time": time.time()}


def send_message_to_user(content: str, room_id: str, crometype: str) -> None:
    """
    Simplified version to send a notification and a message to a user.
    """
    now = time.localtime(time.time())
    emit(
        "send-notification",
        {"crometypes": crometype, "content": content},
        room=room_id
    )
    emit(
        "send-message",
        f"{strftime('%H:%M:%S', now)} - {content}",
        room=room_id
    )


@socketio.on("get-synthesis")
def get_synthesis() -> None:
    """
        get the synthesis created by the user and the examples.
    """
    list_examples = Synthesis.get_synthesis(str(request.args.get("id")))

    emit("receive-synthesis", list_examples, room=request.sid)


@socketio.on("delete-synthesis")
def delete_synthesis(data) -> None:
    """
        Delete a synthesis using only his name to find it.
    """
    session_id = str(request.args.get("id"))

    Synthesis.delete_synthesis(data, session_id)

    send_message_to_user(f"The synthesis \"{data['name']}\" has been deleted.", request.sid, "success")
    emit("synthesis-deleted", True, room=request.sid)


@socketio.on("create-controller")
def create_controller(data) -> None:
    """
        Create the controller and the mealy according to the correct method
    """
    json_content = Synthesis.create_controller(data, request.args.get("id"))
    try:

        send_message_to_user(f"The mealy has been created using {data['mode']} method", request.sid, "success")
        emit("controller-created", json_content, room=request.sid)
    except Exception as e:
        emit("controller-created", False, room=request.sid)
        emit("send-notification", {"content": "The mealy creation has failed. See the console for more information",
                                   "crometypes": "error"}, room=request.sid)
        emit("send-message", f"Mealy \"{data['name']}\" can't be created. Error : {str(e)} ", room=request.sid)


@socketio.on("get-inputs")
def get_inputs(data) -> None:
    """
        Get all the inputs possible for the current state of a controller.
        It differentiates the two ways of simulating the synthesis.
    """
    session_id = request.args.get("id")
    inputs = Simulation.get_input_possible(name=data["name"], session_id=session_id, mode=data["mode"])
    emit("received-inputs", inputs, room=request.sid)


@socketio.on("simulate-controller")
def simulate_controller(data) -> None:
    """
        Simulate the mealy according to the method given
    """
    content = Simulation.react_to_inputs(name=data["name"], session_id=request.args.get("id"), mode=data["mode"],
                                         choice=data["input"])
    send_message_to_user("The mealy has been simulated", "success", request.sid)
    emit("controller-simulated", content, room=request.sid)


@socketio.on("reset-controller")
def reset_controller(data) -> None:
    """
        It reset a controller to his initial state.
        It differentiates the two ways of simulating the synthesis.
    """
    session_id = request.args.get("id")
    Simulation.reset_simulation(name=data["name"], session_id=session_id, mode=data["mode"])
    send_message_to_user("The simulation has been reset", request.sid, "success")
    emit("reset-done", True, room=request.sid)


@socketio.on("random-simulation-controller")
def random_simulation_controller(data) -> None:
    """
        It simulates a controller by randomly choosing the inputs for each state.
        It differentiates the two ways of simulating the synthesis.
    """
    session_id = request.args.get("id")
    content = Simulation.random_simulation(name=data["name"], nb_iteration=data["iterations"], mode=data["mode"],
                                           session_id=session_id)
    emit("receive-random-simulation-controller", content, room=request.sid)
    send_message_to_user(f"A random simulation of {data['iterations']} iterations has been made",
                         request.sid, "success")


if __name__ == "__main__":
    # app.run(host='localhost', debug=True, port=3000)*
    socketio.run(app, host="0.0.0.0")
