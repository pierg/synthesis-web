import random
from hashlib import sha256
from typing import Dict, List

from crome_synthesis.src.crome_synthesis.tools.persistence import (
    dump_mono_controller,
    dump_parallel_controller,
    load_mono_controller,
    load_parallel_controller,
)

from src.backend.shared.paths import save_controller_path


class Simulation:
    """Class that has all the useful functions to simulate a controller.
     Each of those functions differentiate the mode of simulation: Parallel and Strix. Right now, the parallel mode has
     not been implemented."""
    @staticmethod
    def get_input_possible(session_id: str, data: Dict) -> List[str] | None:
        """
        Retrieve the possible inputs of the current state of a controller.

        Arguments:
            session_id: The id of the session where the controller is saved.
            data: A dictionary that contains all the information to find the controller.

        Returns:
            A list containing all the name of the possible inputs. I can return None because the controller has not been
            found or because the mode used to simulate the controller is parallel. It is a mode that is not implemented
            yet.
        """
        save_folder = save_controller_path(session_id, data["mode"])
        if data["mode"] == "parallel":
            return  # Not implemented yet
        elif data["mode"] == "strix":
            complete_str = (
                " ".join(data["inputs"])
                + " ".join(data["outputs"])
                + " ".join(data["guarantees"])
                + " ".join(data["assumptions"])
            )
            full_name = data["name"] + " # " + sha256(complete_str.encode("utf-8")).hexdigest()[:10]
            controller = load_mono_controller(absolute_folder_path=save_folder, controller_name=full_name)
            if not controller:
                return
            tmp = controller.mealy.current_state.possible_inputs
            inputs = [str(i).strip() for i in tmp]
            return inputs

    @staticmethod
    def react_to_inputs(session_id: str, choice: str, data: Dict) -> List | None:
        """
        Make the controller react to a specific input.

        Arguments:
                session_id: The id of the session where the controller is saved.
                choice: The name of the input.
                data: A dictionary that contains all the information to find the controller.

        Return:
            A list that contain all the information about the new state of the controller and the transition
            that has been used. I can return None because the controller has not been found or because the mode used to
            simulate the controller is parallel. It is a mode that is not implemented yet.
        """
        save_folder = save_controller_path(session_id, data["mode"])
        if data["mode"] == "parallel":
            return  # We haven't implemented it yet
        elif data["mode"] == "strix":
            complete_str = (
                " ".join(data["inputs"])
                + " ".join(data["outputs"])
                + " ".join(data["guarantees"])
                + " ".join(data["assumptions"])
            )
            full_name = data["name"] + " # " + sha256(complete_str.encode("utf-8")).hexdigest()[:10]
            controller = load_mono_controller(absolute_folder_path=save_folder, controller_name=full_name)
            if not controller:
                return  # The controller saved is not the one wanted. Glitch !
            input_mealy = None
            for possible_input in controller.mealy.current_state.possible_inputs:
                if str(possible_input).strip() == choice:
                    input_mealy = possible_input
                    break
            controller.mealy.react(input_mealy)
            dump_mono_controller(absolute_folder_path=save_folder, controller=controller)
            return controller.mealy.raw_history

    @staticmethod
    def random_simulation(session_id: str, mode: str, data: Dict) -> List[List] | None:
        """
        It simulates the controller by randomly choosing the inputs for each state.

        Arguments:
            session_id: The id of the session where the controller is.
            mode: The mode of simulation:
            data: A dictionary that contains all the information to find the controller and the number of iteration
            to be done.
        Returns:
            A double list that contain all the information obout the transition made in each state. I can return None
            because the controller has not been found or because the mode used to simulate the controller is parallel.
            It is a mode that is not implemented yet.
        """
        save_folder = save_controller_path(session_id, data["mode"])
        if mode == "parallel":
            return
        if mode == "strix":
            complete_str = (
                " ".join(data["inputs"])
                + " ".join(data["outputs"])
                + " ".join(data["guarantees"])
                + " ".join(data["assumptions"])
            )
            full_name = data["name"] + " # " + sha256(complete_str.encode("utf-8")).hexdigest()[:10]
            controller = load_mono_controller(absolute_folder_path=save_folder, controller_name=full_name)
            if not controller:
                return
            for i in range(int(data["iterations"])):
                choice = random.choice(controller.mealy.current_state.possible_inputs)
                controller.mealy.react(choice)
            dump_mono_controller(absolute_folder_path=save_folder, controller=controller)
            return controller.mealy.raw_history

    @staticmethod
    def reset_simulation(session_id, data) -> bool:
        """
        Reset a controller to the initial state.

        Arguments:
            session_id: The is of the session where the controller is.
            data: A dictionary that contains all the information to find the controller.

        Returns:
            It returns a boolean that indicate if the reset has been done.
        """
        complete_str = (
                " ".join(data["inputs"])
                + " ".join(data["outputs"])
                + " ".join(data["guarantees"])
                + " ".join(data["assumptions"])
        )
        full_name = data["name"] + " # " + sha256(complete_str.encode("utf-8")).hexdigest()[:10]
        save_folder = save_controller_path(session_id, data["mode"])
        if data["mode"] == "parallel":
            pcontroller = load_parallel_controller(absolute_folder_path=save_folder, controller_name=full_name)
            if not pcontroller:
                return False
            for controller in pcontroller.controllers:
                controller.mealy.reset()
            dump_parallel_controller(absolute_folder_path=save_folder, controller=pcontroller)
        elif data["mode"] == "strix":
            controller = load_mono_controller(absolute_folder_path=save_folder, controller_name=full_name)
            if not controller:
                return False
            controller.mealy.reset()
            dump_mono_controller(absolute_folder_path=save_folder, controller=controller)
        return True

    @staticmethod
    def get_history(data: Dict, session_id: str) -> List[List] | None:
        """
        Get the full history of the simulation that have been done to a specific controller.

        Arguments:
            session_id: The is of the session where the controller is.
            data: A dictionary that contains all the information to find the controller.
        Returns:
            A double list that contain all the information obout the transition made in each state. I can return None
            because the controller has not been found or because the mode used to simulate the controller is parallel.
            It is a mode that is not implemented yet.
        """
        save_folder = save_controller_path(session_id, data["mode"])
        if data["mode"] == "parallel":
            return  # Not implemented yet
        elif data["mode"] == "strix":
            complete_str = (
                " ".join(data["inputs"])
                + " ".join(data["outputs"])
                + " ".join(data["guarantees"])
                + " ".join(data["assumptions"])
            )
            full_name = data["name"] + " # " + sha256(complete_str.encode("utf-8")).hexdigest()[:10]
            controller = load_mono_controller(absolute_folder_path=save_folder, controller_name=full_name)
            if not controller:
                return []
            return controller.mealy.raw_history
