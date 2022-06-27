import random

from backend.shared.objects import arrayRunFile, getter_line, setter_line
from backend.shared.paths import controller_path
from crome_synthesis.tools.persistence import dump_mono_controller, load_mono_controller, load_parallel_controller, \
    dump_parallel_controller


class Simulation:

    @staticmethod
    def get_input_possible(session_id, mode, project_id=None, name=None):
        controller_folder = controller_path(session_id)
        if mode == "crome":
            return ["person", ""]
        elif mode == "parallel":
            return  # Not implemented yet
        elif mode == "strix":
            controller = load_mono_controller(absolute_folder_path=controller_folder, controller_name=name)
            if not controller:
                return
            tmp = controller.mealy.current_state.possible_inputs
            inputs = [str(i).strip() for i in tmp]
            return inputs

    @staticmethod
    def react_to_inputs(session_id, choice, mode, project_id=None, name=None):
        if mode == "crome":
            result = arrayRunFile[getter_line()]
            setter_line(getter_line() + 1)
            return result
        elif mode == "parallel":
            return  # We haven't implemented it yet
        elif mode == "strix":
            controller_folder = controller_path(session_id)
            controller = load_mono_controller(absolute_folder_path=controller_folder, controller_name=name)
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
            dump_mono_controller(absolute_folder_path=controller_folder, controller=controller)
            return result

    @staticmethod
    def random_simulation(session_id, mode, nb_iteration, project_id=None, name=None):
        controller_folder = controller_path(session_id)
        if mode == "crome":
            beforeLine = getter_line()
            lineToSend = min(getter_line()+25, len(arrayRunFile))
            setter_line(lineToSend)
            return [arrayRunFile[i] for i in range(beforeLine, lineToSend)]
        elif mode == "parallel":
            return
        if mode == "strix":
            controller = load_mono_controller(absolute_folder_path=controller_folder, controller_name=name)
            if not controller:
                return
            history = []
            for i in range(int(nb_iteration)):
                old_state = controller.mealy.current_state.name
                choice = random.choice(controller.mealy.current_state.possible_inputs)
                outputs = controller.mealy.react(choice)
                outputs = " ".join([str(a) for a in outputs.sorted])
                new_state = controller.mealy.current_state.name
                history.append([str(choice).strip(), old_state, new_state, outputs])
            dump_mono_controller(absolute_folder_path=controller_folder, controller=controller)
            return history

    @staticmethod
    def reset_simulation(session_id, mode, project_id=None, name=None):
        if mode == "crome":
            setter_line(0)
            return
        elif mode == "parallel":
            controller_folder = controller_path(session_id)
            pcontroller = load_parallel_controller(absolute_folder_path=controller_folder, controller_name=name)
            if not pcontroller:
                return
            for controller in pcontroller.controllers:
                controller.mealy.reset()
            dump_parallel_controller(absolute_folder_path=controller_folder, controller=pcontroller)
        elif mode == "strix":
            controller_folder = controller_path(session_id)
            controller = load_mono_controller(absolute_folder_path=controller_folder, controller_name=name)
            if not controller:
                return
            controller.mealy.reset()
            dump_mono_controller(absolute_folder_path=controller_folder, controller=controller)

