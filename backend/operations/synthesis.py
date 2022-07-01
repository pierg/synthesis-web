import os
from os import walk
from pathlib import Path
from typing import Any, List

from backend.shared.paths import controller_path
from crome_logic.specification.temporal import LTL
from crome_logic.typelement.basic import BooleanControllable, BooleanUncontrollable
from crome_logic.typeset import Typeset
from crome_synthesis.controller import _check_header, Controller
from crome_synthesis.controller.controller_info import ControllerSpec
from crome_synthesis.pcontrollers import PControllers
from crome_synthesis.tools.persistence import dump_mono_controller, load_mono_controller, load_parallel_controller, \
    dump_parallel_controller


class Synthesis:

    @staticmethod
    def get_synthesis(session_id) -> dict[str, list[Any]]:
        list_controller = {}
        # We get all the controller already synthesize
        controller_folder = controller_path(session_id)
        if os.path.isdir(controller_folder):
            _, dir_names, filenames = next(walk(controller_folder))
            dict_controller = {"strix": [], "parallel": []}
            for dir_name in dir_names:
                mode = dir_name[5:]
                _, _, filenames = next(walk(controller_folder / dir_name))
                load_function = None
                if mode == "strix":
                    load_function = load_mono_controller
                elif mode == "parallel":
                    load_function = load_parallel_controller
                for filename in filenames:
                    controller = load_function(absolute_folder_path=controller_folder / dir_name,
                                               controller_name=filename.split(".")[0][:-2])
                    data = {"id": controller.name, "assumptions": controller.spec.a, "guarantees": controller.spec.g,
                            "inputs": controller.spec.i, "outputs": controller.spec.o}
                    dict_controller[mode].append(data)
            list_controller.update(dict_controller)

        # Now we get all the examples !
        controller_folder = controller_path("default")
        _, dir_names, _ = next(walk(controller_folder))
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
    def get_controller(session_id):
        controller_folder = controller_path(session_id)
        list_controller_strix = Synthesis.__get_controller_from_folder(controller_folder / "save_strix", "strix")
        list_controller_parallel = Synthesis.__get_controller_from_folder(controller_folder / "save_parallel", "parallel")
        dict_controller_info = {"parallel": [], "strix": []}
        for controller in list_controller_strix:
            data = {"id": controller.name, "assumptions": controller.spec.a, "guarantees": controller.spec.g,
                    "inputs": controller.spec.i, "outputs": controller.spec.o}
            dict_controller_info["strix"].append(data)
        for controller in list_controller_parallel:
            data = {"id": controller.name, "assumptions": controller.spec.a, "guarantees": controller.spec.g,
                    "inputs": controller.spec.i, "outputs": controller.spec.o}
            dict_controller_info["parallel"].append(data)
        return dict_controller_info

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
    def create_controller(data, session_id) -> list[str] | str:
        controller_folder = controller_path(session_id)
        full_name = data["name"] + hash(" ".join(data["inputs"]) + " ".join(data["outputs"])
                                        + " ".join(data["guarantees"]) + " ".join(data["assumptions"]))
        save_folder = controller_folder / f"save_{data['mode']}"
        if data["mode"] == "strix":
            controller_found = load_mono_controller(absolute_folder_path=save_folder, controller_name=full_name)
            if controller_found:
                return Synthesis.__upgrade_dot(controller_found.get_format("dot"))
            else:
                spec = ControllerSpec(a=data["assumptions"], g=data["guarantees"], i=data["inputs"], o=data["outputs"])
                controller = Controller(name=data["name"], spec=spec)
                dump_mono_controller(absolute_folder_path=save_folder, controller=controller)
                return Synthesis.__upgrade_dot(controller_found.get_format("dot"))
        else:
            controller_found = load_parallel_controller(absolute_folder_path=save_folder, controller_name=full_name)
            if controller_found:
                json_content = []
                for controller in controller_found.controllers:
                    json_content.append(Synthesis.__upgrade_dot(controller.get_format("dot")))
                return json_content
            else:
                spec = ControllerSpec(a=data["assumptions"], g=data["guarantees"], i=data["inputs"], o=data["outputs"])
                set_ap_i = set(map(lambda x: BooleanUncontrollable(name=x), spec.i))
                set_ap_o = set(map(lambda x: BooleanControllable(name=x), spec.o))
                typeset = Typeset(set_ap_i | set_ap_o)
                ltl_formula = LTL(_init_formula=spec.formula, _typeset=typeset)
                pcontroller = PControllers.from_ltl(guarantees=ltl_formula, name=data["name"])
                dump_mono_controller(absolute_folder_path=save_folder, controller=pcontroller)
                json_content = []
                for controller in pcontroller.controllers:
                    json_content.append(Synthesis.__upgrade_dot(controller.get_format("dot")))
                return json_content

    @staticmethod
    def get_mealy_from_controller(name, session_id, mode):
        controller_folder = controller_path(session_id)
        save_folder = controller_folder / f"save_{mode}"
        _, _, filenames = next(walk(save_folder))
        for filename in filenames:
            if name == filename.split(".")[0][0:-2]:
                if mode == "strix":
                    controller = load_mono_controller(absolute_folder_path=save_folder, controller_name=name)
                    return Synthesis.__upgrade_dot(controller.get_format("dot"))
                elif mode == "parallel":
                    pcontroller = load_parallel_controller(absolute_folder_path=save_folder, controller_name=name)
                    json_content = []
                    for controller in pcontroller.controllers:
                        json_content.append(Synthesis.__upgrade_dot(controller.spot_automaton.to_str("dot")))
                    return json_content

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
    def __get_controller_from_folder(folder, mode) -> list[Controller]:
        if not os.path.exists(folder):
            return []
        _, _, filenames = next(walk(folder))
        load_function = None
        if mode == "strix":
            load_function = load_mono_controller
        elif mode == "parallel":
            load_function = load_parallel_controller
        result = []
        for filename in filenames:
            controller = load_function(absolute_folder_path=folder, controller_name=filename.split(".")[0][:-2])
            result.append(controller)
        return result
