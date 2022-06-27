import os
import random
from os import walk
from pathlib import Path
from typing import Any

from backend.shared.paths import controller_path
from crome_synthesis.controller import _check_header, Controller
from crome_synthesis.controller.controller_info import ControllerSpec
from crome_synthesis.pcontrollers import PControllers
from crome_synthesis.tools.persistence import dump_mono_controller, load_mono_controller, load_parallel_controller, \
    dump_parallel_controller


class Synthesis:

    @staticmethod
    def get_synthesis(session_id) -> dict[str, list[Any]]:
        list_controller = {}
        # We get the controller of the current session
        controller_folder = controller_path(session_id)
        if os.path.isdir(controller_folder):
            _, _, filenames = next(walk(controller_folder))
            dict_controller = {"Your creation": []}
            for filename in filenames:
                if len(filename.split(".")) == 2 and filename.split(".")[-1] == "dat":
                    continue
                info = ControllerSpec.from_file(controller_folder / filename)
                name = Synthesis.__get_name_controller(controller_folder / filename)
                data = {"id": name, "assumptions": info.a, "guarantees": info.g, "inputs": info.i,
                        "outputs": info.o}
                dict_controller["Your creation"].append(data)
            list_controller.update(dict_controller)
        # Now we get all the examples !
        controller_folder = controller_path("default")
        dir_path, dir_names, _ = next(walk(controller_folder))
        for dir_name in dir_names:
            _, _, filenames = next(walk(os.path.join(controller_folder, dir_name)))
            dict_controller = {dir_name: []}
            for filename in filenames:
                info = ControllerSpec.from_file(controller_folder / dir_name / filename)
                name = Synthesis.__get_name_controller(controller_folder / dir_name / filename)
                data = {"id": name, "assumptions": info.a, "guarantees": info.g, "inputs": info.i,
                        "outputs": info.o}
                dict_controller[dir_name].append(data)
            list_controller.update(dict_controller)
        return list_controller

    @staticmethod
    def create_txt_file(data, session_id) -> None:
        controller_folder = controller_path(session_id)

        if not os.path.exists(controller_folder):
            os.makedirs(controller_folder)
        _, _, filenames = next(walk(controller_folder))
        m = -1
        for filename in filenames:
            sp = filename.split('.')
            if sp[-1] == "txt":
                if m < int(sp[0]):
                    m = int(sp[0])
        greatest_id = m + 1

        # We check if the same name don't already exist. If so we use the same .txt
        file_checked = Synthesis.__check_if_controller_exist(data["name"], controller_folder)
        file = os.path.join(controller_folder, f"{str(greatest_id).zfill(4)}.txt")
        if file_checked:
            file = os.path.join(controller_folder, file_checked)

        with open(file, "w") as file:
            file.write("**NAME**\n\n")
            file.write(f"{data['name']}\n\n")

            file.write("**ASSUMPTIONS**\n\n")
            for assumption in data["assumptions"]:
                file.write(f"{assumption}\n")

            file.write("\n**GUARANTEES**\n\n")
            for guarantee in data["guarantees"]:
                file.write(f"{guarantee}\n")

            file.write("\n**INPUTS**\n\n")
            for i in range(len(data["inputs"])):
                controller_input = data["inputs"][i]
                if i == len(data["inputs"]) - 1:
                    file.write(f"{controller_input}")
                else:
                    file.write(f"{controller_input}, ")
            file.write("\n")

            file.write("\n**OUTPUTS**\n\n")
            for i in range(len(data["outputs"])):
                controller_output = data["outputs"][i]
                if i == len(data["outputs"]) - 1:
                    file.write(f"{controller_output}")
                else:
                    file.write(f"{controller_output}, ")
            file.write("\n")

            file.write("\n**END**")

    @staticmethod
    def delete_synthesis(name, session_id):
        controller_folder = controller_path(session_id)
        _, _, filenames = next(walk(controller_folder))
        for filename in filenames:
            if len(filename.split(".")) == 2 and filename.split(".")[-1] == "dat":
                continue
            name_found = Synthesis.__get_name_controller(controller_folder / filename)
            if name_found == name:
                os.remove(controller_folder / filename)

    @staticmethod
    def create_controller(name, session_id, mode, controller_return=False)\
            -> list[str] | str | None | Controller | PControllers:
        list_session = [session_id, "default"]

        controller_file = None
        controller_folder = None
        stop = False
        for session in list_session:
            controller_folder = controller_path(session)
            controller_file = Synthesis.__check_if_controller_exist(name, controller_folder)
            if controller_file:
                controller_file = Path(os.path.join(controller_folder, controller_file))
                break
            else:
                if session == "default":
                    _, dir_names, _ = next(walk(controller_folder))
                    for dir_name in dir_names:
                        controller_file = Synthesis.__check_if_controller_exist(name, controller_folder / dir_name)
                        if controller_file:
                            controller_file = Path(os.path.join(controller_folder / dir_name, controller_file))
                            stop = True
                            break
            if stop:
                break

        if controller_file:
            if mode == "crome":
                pcontrollers = PControllers.from_file(file_path=controller_file)
                # We have to dump the pcontrollers when the function will be written and works correctly
                if controller_return:
                    return pcontrollers
                json_content = []
                for controller in pcontrollers.controllers:
                    json_content.append(Synthesis.__upgrade_dot(controller.spot_automaton.to_str("dot")))
                return json_content
            elif mode == "strix":
                controller = Controller.from_file(file_path=controller_file)
                Synthesis.__remove_dat_file(controller_folder)
                dump_mono_controller(absolute_folder_path=controller_folder, controller=controller)
                if controller_return:
                    return controller
                return Synthesis.__upgrade_dot(controller.get_format("dot"))
            else:
                # Not a good mode !
                return None

    @staticmethod
    def get_specific_synthesis(data, session_id):
        list_session = ["default", session_id]
        file = None
        dir = None
        controller_folder = None
        stop = False
        for session in list_session:
            controller_folder = controller_path(session)
            file = Synthesis.__check_if_controller_exist(data["name"], controller_folder)
            if file:
                break
            _, dir_names, _ = next(walk(controller_folder))
            for dir_name in dir_names:
                file = Synthesis.__check_if_controller_exist(data["name"], controller_folder / dir_name)
                if file:
                    stop = True
                    break
            if stop:
                break

        if file:
            if dir:
                controller = Controller.from_file(controller_folder / dir / file)
            else:
                controller = Controller.from_file(controller_folder / file)
            content = {"assumptions": controller.info.a, "guarantees": controller.info.g,
                       "inputs": controller.info.i,
                       "outputs": controller.info.o, "name": data["name"]}
            return content

    @staticmethod
    def __check_if_controller_exist(name, controller_folder) -> str:
        if not name:
            return ""
        _, _, filenames = next(walk(controller_folder))
        for filename in filenames:
            if len(filename.split(".")) == 2 and filename.split(".")[-1] == "dat":
                continue
            name_found = Synthesis.__get_name_controller(controller_folder / filename)
            if name_found == name:
                return filename
        return ""

    @staticmethod
    def __get_name_controller(file) -> str:
        with open(file, 'r') as ifile:
            name_found = False
            for line in ifile:
                if not line.strip():
                    continue

                if name_found:
                    return line.strip()
                line, header = _check_header(line)

                if header:
                    if line == "**NAME**":
                        name_found = True
        return ""

    @staticmethod
    def __upgrade_dot(raw_dot: str) -> str:
        lst = raw_dot.split("\n")
        result = []
        for line in lst:
            if "->" in line and "label" in line:  # It's a line with a
                split_line = line.split("label=")
                to_modify = split_line[1].replace(']', '').replace('"', '')
                lst_to_modify = to_modify.split("&")
                tmp = []
                for elt in lst_to_modify:
                    if "!" not in elt:
                        tmp.append(elt.replace(' ', ''))
                split_line[1] = " & ".join(tmp)
                line = 'label="'.join(split_line) + '"]'
            result.append(line)
        return "\n".join(result)

    @staticmethod
    def __remove_dat_file(folder):
        _, _, filenames = next(walk(folder))
        for filename in filenames:
            tmp = filename.split(".")
            if len(tmp) == 2 and tmp[-1] == "dat":
                os.remove(folder / filename)
