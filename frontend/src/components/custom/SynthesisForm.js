import React from 'react';
import {Classes, Tree} from "@blueprintjs/core";
import {Link} from "react-scroll";

import Button from "../elements/Button";

import synthesisInfo from "../../_texts/synthesisinfo";
import LTLEdit from "./LTLEdit";
import SynthesisInput from "./SynthesisInput";

function SynthesisForm(props) {


    return(<div className="w-full lg:w-9/12 xl:w-10/12 flex-col mt-5 mx-auto pb-5">
                    <div className="px-3 pb-3 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">
                        <div className="flex flex-col justify-center p-5 ">
                            <div className="container">
                                <div className="row">
                                    <div className="col-8">
                                        <SynthesisInput
                                            title={synthesisInfo.info.texts.name}
                                            value={props.nameValue}
                                            setValue={props.setNameValue}
                                        />
                                        <div className="row mt-5">
                                            <div className="col-3 mt-2 fs-5 text-right text-blueGray-500 uppercase font-bold">
                                                {synthesisInfo.info.texts.assumptions}
                                            </div>
                                            <div className="col-8 relative">
                                                <LTLEdit
                                                    goalEdit={false}
                                                    value={props.assumptionsValue}
                                                    setValue={props.setAssumptionsValue}
                                                    size={16}
                                                    inputsValue={props.inputsValue}
                                                    outputsValue={props.outputsValue}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-5">
                                            <div className="col-3 mt-2 fs-5 text-right text-blueGray-500 uppercase font-bold">
                                                {synthesisInfo.info.texts.guarantees}
                                            </div>
                                            <div className="col-8 relative">
                                                <LTLEdit
                                                    goalEdit={false}
                                                    value={props.guaranteesValue}
                                                    setValue={props.setGuaranteesValue}
                                                    size={16}
                                                    inputsValue={props.inputsValue}
                                                    outputsValue={props.outputsValue}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-5">
                                            <SynthesisInput
                                                title={synthesisInfo.info.texts.inputs}
                                                value={props.inputsValue}
                                                setValue={props.setInputsValue}
                                            />
                                        </div>
                                        <div className="mt-5">
                                            <SynthesisInput
                                                title={synthesisInfo.info.texts.outputs}
                                                value={props.outputsValue}
                                                setValue={props.setNameValue}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="row">
                                            <div className="text-center fs-6 text-blueGray-500 uppercase font-bold">
                                                {synthesisInfo.info.texts.load}
                                            </div>
                                        </div>
                                        <div className="row mt-3 relative">
                                            <Tree
                                                contents={props.tree}
                                                className={Classes.TEXT_SMALL}
                                                onNodeClick={e => props.changeIsOpen({e: e})}
                                            />
                                            {props.creationExpanded && props.deleteCreation}
                                        </div>
                                    </div>
                                </div>
                                <div className="container mt-16">
                                    <div className="row">
                                        <div id="buttons" className="col-3 offset-2">
                                            <Link  to="synthesis" spy={true} smooth={true}>
                                                <Button
                                                    id="buttonSynthesisStrix"
                                                    color={synthesisInfo.info.buttons.synthesis.color}
                                                    size="lg"
                                                    outline={props.clickedButtonStrix}
                                                    fullWidth={true}
                                                    onClick={props.synthesisStrix}
                                                >
                                                    {synthesisInfo.info.buttons.synthesis.strix}
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="col-3 offset-2">
                                             <Link  to="synthesis" spy={true} smooth={true}>
                                                <Button
                                                    id="buttonParallelSynthesis"
                                                    color={synthesisInfo.info.buttons.synthesis.color}
                                                    size="lg"
                                                    outline={props.clickedButtonParallel}
                                                    fullWidth={true}
                                                    onClick={props.parallelSynthesis}
                                                >
                                                    {synthesisInfo.info.buttons.synthesis.parallel}
                                                </Button>
                                             </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>);
}

export default SynthesisForm;