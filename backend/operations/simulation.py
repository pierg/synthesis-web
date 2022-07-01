import random
from hashlib import sha256

from backend.shared.paths import save_controller_path
from crome_synthesis.tools.persistence import dump_mono_controller, load_mono_controller, load_parallel_controller, \
    dump_parallel_controller


# noinspection DuplicatedCode
class Simulation:

    @staticmethod
    def get_input_possible(session_id, data):
        print(data)
        save_folder = save_controller_path(session_id, data["mode"])
        if data["mode"] == "parallel":
            return  # Not implemented yet
        elif data["mode"] == "strix":
            complete_str = " ".join(data["inputs"]) + " ".join(data["outputs"]) + " ".join(data["guarantees"]) \
                           + " ".join(data["assumptions"])
            full_name = data["name"] + " # " + sha256(complete_str.encode('utf-8')).hexdigest()[:10]
            controller = load_mono_controller(absolute_folder_path=save_folder, controller_name=full_name)
            if not controller:
                return
            tmp = controller.mealy.current_state.possible_inputs
            inputs = [str(i).strip() for i in tmp]
            return inputs

    @staticmethod
    def react_to_inputs(session_id, choice, data):
        save_folder = save_controller_path(session_id, data["mode"])
        if data["mode"] == "parallel":
            return  # We haven't implemented it yet
        elif data["mode"] == "strix":
            complete_str = " ".join(data["inputs"]) + " ".join(data["outputs"]) + " ".join(data["guarantees"]) \
                           + " ".join(data["assumptions"])
            full_name = data["name"] + " # " + sha256(complete_str.encode('utf-8')).hexdigest()[:10]
            controller = load_mono_controller(absolute_folder_path=save_folder, controller_name=full_name)
            if not controller:
                return  # The controller saved is not the one wanted. Glitch !
            old_state = controller.mealy.current_state.name
            input_mealy = None
            for possible_input in controller.mealy.current_state.possible_inputs:
                if str(possible_input).strip() == choice:
                    input_mealy = possible_input
                    break
            outputs = controller.mealy.react(input_mealy)
            outputs = " ".join([str(a) for a in outputs.sorted])
            result = [choice, old_state, controller.mealy.current_state.name, outputs]
            return result

    @staticmethod
    def random_simulation(session_id, mode, data):
        save_folder = save_controller_path(session_id, data["mode"])
        if mode == "parallel":
            return
        if mode == "strix":
            complete_str = " ".join(data["inputs"]) + " ".join(data["outputs"]) + " ".join(data["guarantees"]) \
                           + " ".join(data["assumptions"])
            full_name = data["name"] + " # " + sha256(complete_str.encode('utf-8')).hexdigest()[:10]
            controller = load_mono_controller(absolute_folder_path=save_folder, controller_name=full_name)
            if not controller:
                return
            history = []
            for i in range(int(data["iterations"])):
                old_state = controller.mealy.current_state.name
                choice = random.choice(controller.mealy.current_state.possible_inputs)
                outputs = controller.mealy.react(choice)
                outputs = " ".join([str(a) for a in outputs.sorted])
                new_state = controller.mealy.current_state.name
                history.append([str(choice).strip(), old_state, new_state, outputs])
            dump_mono_controller(absolute_folder_path=save_folder, controller=controller)
            return history

    @staticmethod
    def reset_simulation(session_id, data):
        save_folder = save_controller_path(session_id, data["mode"])
        if data["mode"] == "parallel":
            pcontroller = load_parallel_controller(absolute_folder_path=save_folder, controller_name=None)
            if not pcontroller:
                return
            for controller in pcontroller.controllers:
                controller.mealy.reset()
            dump_parallel_controller(absolute_folder_path=save_folder, controller=pcontroller)
        elif data["mode"] == "strix":
            complete_str = " ".join(data["inputs"]) + " ".join(data["outputs"]) + " ".join(data["guarantees"]) \
                           + " ".join(data["assumptions"])
            full_name = data["name"] + " # " + sha256(complete_str.encode('utf-8')).hexdigest()[:10]
            controller = load_mono_controller(absolute_folder_path=save_folder, controller_name=full_name)
            if not controller:
                return
            controller.mealy.reset()
            dump_mono_controller(absolute_folder_path=save_folder, controller=controller)

