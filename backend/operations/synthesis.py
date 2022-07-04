import base64
import os
from os import walk
from typing import Any

from hashlib import sha256
from backend.shared.paths import controller_path, save_controller_path
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
                    if os.path.splitext(filename)[1] == ".png":
                        continue
                    controller = load_function(absolute_folder_path=controller_folder / dir_name,
                                               controller_name=filename.split(".")[0][:-2])
                    name_split = controller.name.split(" # ")
                    name_split.pop(-1)
                    name = " # ".join(name_split)
                    data = {"id": name, "assumptions": controller.spec.a, "guarantees": controller.spec.g,
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
    def delete_synthesis(data, session_id):
        complete_str = " ".join(data["inputs"]) + " ".join(data["outputs"]) + " ".join(data["guarantees"]) \
                       + " ".join(data["assumptions"])
        full_name = data["name"] + " # " + sha256(complete_str.encode('utf-8')).hexdigest()[:10]
        save_folder = save_controller_path(session_id, data["mode"])
        os.remove(save_folder / f"{full_name}_s.dat")

    @staticmethod
    def create_controller(data, session_id) -> list[str] | str:
        complete_str = " ".join(data["inputs"]) + " ".join(data["outputs"]) + " ".join(data["guarantees"]) \
                       + " ".join(data["assumptions"])
        full_name = data["name"] + " # " + sha256(complete_str.encode('utf-8')).hexdigest()[:10]
        save_folder = save_controller_path(session_id, data["mode"])
        if data["mode"] == "strix":
            if os.path.exists(save_folder / f"{full_name}.png"):
                with open(save_folder / f"{full_name}.png", "rb") as file:
                    read_png_file = base64.b64encode(file.read())
                    return str(read_png_file)
            controller_found = load_mono_controller(absolute_folder_path=save_folder, controller_name=full_name)
            if controller_found:
                controller_found.save(format="png", absolute_folder_path=save_folder)
                with open(save_folder / f"{full_name}.png", "rb") as file:
                    read_png_file = base64.b64encode(file.read())
                    return str(read_png_file)
            else:
                spec = ControllerSpec(a=data["assumptions"], g=data["guarantees"], i=data["inputs"], o=data["outputs"])
                controller = Controller(name=full_name, spec=spec)
                dump_mono_controller(absolute_folder_path=save_folder, controller=controller)
                controller.save(format="png", absolute_folder_path=save_folder)
                with open(save_folder / f"{full_name}.png", "rb") as file:
                    read_png_file = base64.b64encode(file.read())
                    return str(read_png_file)
        else:
            controller_found = load_parallel_controller(absolute_folder_path=save_folder, controller_name=full_name+"_p")
            if controller_found:
                print("Found !")
                json_content = []
                for controller in controller_found.controllers:
                    if not os.path.exists(save_folder / f"{controller.name}.png"):
                        controller.save(absolute_folder_path=save_folder, format="png")
                    with open(save_folder / f"{controller.name}.png", "rb") as file:
                        read_png_file = base64.b64encode(file.read())
                        json_content.append(str(read_png_file))
                return json_content
            else:
                spec = ControllerSpec(a=data["assumptions"], g=data["guarantees"], i=data["inputs"], o=data["outputs"])
                set_ap_i = set(map(lambda x: BooleanUncontrollable(name=x), spec.i))
                set_ap_o = set(map(lambda x: BooleanControllable(name=x), spec.o))
                typeset = Typeset(set_ap_i | set_ap_o)
                ltl_formula = LTL(_init_formula=spec.formula, _typeset=typeset)
                pcontroller = PControllers.from_ltl(guarantees=ltl_formula, name=full_name)
                pcontroller.spec = spec
                dump_parallel_controller(absolute_folder_path=save_folder, controller=pcontroller)
                json_content = []
                for controller in pcontroller.controllers:
                    controller.save(absolute_folder_path=save_folder, format="png")
                    print(controller.name)
                    with open(save_folder / f"{controller.name}.png", "rb") as file:
                        read_png_file = base64.b64encode(file.read())
                        json_content.append(str(read_png_file))
                return json_content
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
