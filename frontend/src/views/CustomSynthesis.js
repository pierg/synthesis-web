import React from "react";
import {Link} from 'react-scroll';
import '@blueprintjs/core/lib/css/blueprint.css';
import { Graphviz } from 'graphviz-react';
import {toast} from "react-toastify";

import SocketSaveSynthesis from "../components/socketConnection/SaveSynthesis";
import SocketDeleteSynthesis from "../components/socketConnection/DeleteSynthesis";
import SocketGetSynthesis from "../components/socketConnection/GetSynthesis";
import SocketGetExamples from "../components/socketConnection/GetExamples";

import Button from "../components/elements/Button";
import synthesisInfo from "../_texts/synthesisinfo";
import customfooter from "../_texts/customfooter";

import Simulation from "../components/custom/Simulation";
import SynthesisForm from "../components/custom/SynthesisForm";
import CustomFooter from "../components/custom/CustomFooter";

export default class CustomSynthesis extends React.Component {

    state = {
        nameValue : "",
        assumptionsValue : "",
        guaranteesValue : "",
        inputsValue : "",
        outputsValue : "",

        triggerExample : true,
        tree : [],
        isOpen : [],
        nameToDelete : "",
        nbFolders : 0,
        nbExampleCreation : 0,
        creationExpanded: false,
        triggerSave : false,
        triggerDelete : false,

        triggerSynthesis : false,
        toastLoading : null,
        clickedButtonStrix : false,
        clickedButtonParallel : false,
        network : null,
        graph : null,
        simulation : false,
    }

    setNameValue = (e) => {
        this.setState({
            nameValue : e.target.value
        })
    }

    setAssumptionsValue = (value) => {
        this.setState({
            assumptionsValue : value
        })
    }

    setGuaranteesValue = (value) => {
        this.setState({
            guaranteesValue : value
        })
    }

    setInputsValue = (e) => {
        this.setState({
            inputsValue : e.target.value
        })
    }

    setOutputsValue = (e) => {
        this.setState({
            outputsValue : e.target.value
        })
    }

    setGraph = (graph) => {
        const toastId = this.state.toastLoading
        toast.dismiss(toastId)
        this.setState({
            graph : graph,
            toastLoading: null,
        })
    }

    loadFormula = () => {
        this.setTriggerSave(true)
    }

    setTriggerExample = (bool) => {
        this.setState({
            triggerExample: bool
        })
    }

    changeIsOpen = ({e}) => {
        e.isExpanded = !e.isExpanded
        let creationExpanded = this.state.creationExpanded
        let sizeFolder = this.state.nbFolders
        if(e.id.length !== undefined) {
            this.setState({
                nameValue : e.label,
                assumptionsValue : e.assumptions.join("\n"),
                guaranteesValue : e.guarantees.join("\n"),
                inputsValue : e.inputs.join(", "),
                outputsValue : e.outputs.join(", "),
            })
        }
        else {
            if(e.label !== "Your creation") {
                if(!e.isExpanded) {
                    sizeFolder -= e.childNodes.length
                }
                else {
                    sizeFolder += e.childNodes.length
                }
            }
            else {
                creationExpanded = e.isExpanded
            }
        }
        this.setState({
            clickedButtonStrix : false,
            clickedButtonParallel : false,
            triggerSynthesis : false,
            graph: null,
            simulation: false,
            nbFolders: sizeFolder,
            creationExpanded: creationExpanded,
        })
    }

    setTree = (tree) => {
        let treeTmp = []
        let keys = Object.keys(tree).sort()
        let node
        let nbExampleCreation = 0
        for(let i=0;i<keys.length;i++) {
            node = {}
            node.id = i
            node.label = keys[i]
            node.icon = "folder-close"
            node.isExpanded = false
            node.childNodes = []

            let childNode
            for(let j=0;j<tree[keys[i]].length;j++) {
                childNode = {}
                childNode.id = i+"_"+j
                childNode.label = tree[keys[i]][j].id
                if(keys[i] === "Your creation") {
                    nbExampleCreation++
                }
                childNode.assumptions = tree[keys[i]][j].assumptions
                childNode.guarantees = tree[keys[i]][j].guarantees
                childNode.inputs = tree[keys[i]][j].inputs
                childNode.outputs = tree[keys[i]][j].outputs
                node.childNodes[j] = childNode
            }

            treeTmp[i] = node
        }

        this.setState({
            tree : treeTmp,
            nbFolders : keys.length,
            nbExampleCreation : nbExampleCreation,
            creationExpanded: false,
        })
    }

    deleteCreationClick = (nodeId) => {
        this.setState({
            nameToDelete: this.state.tree[this.state.tree.length-1].childNodes[nodeId].label
        })
        this.setTriggerDelete(true)
    }

    setTriggerSave = (bool) => {
        this.setState({
            triggerSave: bool
        })
    }

    setTriggerDelete = (bool) => {
        this.setState({
            triggerDelete: bool
        })
    }

    savedDone = () => {
        const toastId = toast.loading('Synthesis is working, please wait')
        this.setState({
            toastLoading: toastId
        })
        this.setTriggerExample(true)
    }

    deletedDone = () => {
        this.setTriggerExample(true)
    }

    setTriggerSynthesis = (bool) => {
        this.setState({
            triggerSynthesis: bool
        })
    }

    synthesisStrix = () => {
        this.setTriggerSave(true)
        this.setState({
            clickedButtonStrix : true,
            clickedButtonParallel : false,
            triggerSynthesis : true,
            graph: null,
            simulation: false
        })
    }

    parallelSynthesis = () => {
        this.setTriggerSave(true)
        this.setState({
            clickedButtonStrix : false,
            clickedButtonParallel : true,
            triggerSynthesis : true,
            graph : null,
            simulation: false
        })
    }

    clickSimulation = () => {
        this.setState({
            simulation: true
        })
    }

    render(){
        const deleteCreation = [];
        for (let i = 0; i < this.state.nbExampleCreation; i += 1) {
            deleteCreation.push(
                <button
                    key={i}
                    style={{top: ((this.state.nbFolders+i)*30)+"px", right: "10px", height: "30px", width: "30px"}}
                    className="absolute text-right"
                    onClick={() => this.deleteCreationClick(i)}
                >
                    <span className="fas fa-trash"></span>
                </button>
            );
        }

        let width=window.innerWidth

        const children = [];
        let graph
        if (this.state.clickedButtonParallel && this.state.graph) {
            for (let i = 0; i < this.state.graph.length; i += 1) {
                graph = this.state.graph[i].slice(0,this.state.graph[i].indexOf("{")+1)+'\n  bgcolor="#F1F5F9"'+this.state.graph[i].slice(this.state.graph[i].indexOf("{")+1)
                children.push(<Graphviz
                                dot={graph}
                                key={i}
                                options={({
                                    fit: true,
                                    height: 300,
                                    width: width / 4.2,
                                    zoom: true
                                })}
                                className="p-2 m-3 border-solid border-2 rounded-md flex bg-blueGray-100 border-blueGray-100 wrap-content"/>);
            }
        }

        return (
            <>
                <SocketGetExamples
                    trigger={this.state.triggerExample}
                    setTrigger={this.setTriggerExample}
                    setTree={this.setTree}
                />
                <SocketSaveSynthesis
                    trigger={this.state.triggerSave}
                    setTrigger={this.setTriggerSave}
                    savedDone={this.savedDone}
                    name={this.state.nameValue}
                    assumptions={this.state.assumptionsValue.split("\n")}
                    guarantees={this.state.guaranteesValue.split("\n")}
                    inputs={this.state.inputsValue.split(",")}
                    outputs={this.state.outputsValue.split(",")}
                />
                <SocketDeleteSynthesis
                    trigger={this.state.triggerDelete}
                    setTrigger={this.setTriggerDelete}
                    deletedDone={this.deletedDone}
                    name={this.state.nameToDelete}
                />
                <SocketGetSynthesis
                    trigger={this.state.triggerSynthesis}
                    setTrigger={this.setTriggerSynthesis}
                    name={this.state.nameValue}
                    strix={this.state.clickedButtonStrix}
                    parallel={this.state.clickedButtonParallel}
                    setGraph={this.setGraph}
                />
                <div className="relative pt-8 pb-12 bg-emerald-400 ">
                    <div className="px-4 md:px-6 mx-auto w-full">
                        <div>
                            <div className="flex flex-wrap justify-center">
                                <h1 className="display-3 title-up text-white font-semibold text-center">
                                    {synthesisInfo.info.texts.synthesis}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <SynthesisForm
                    nameValue={this.state.nameValue}
                    setNameValue={this.setNameValue}
                    assumptionsValue={this.state.assumptionsValue}
                    setAssumptionsValue={this.setAssumptionsValue}
                    inputsValue={this.state.inputsValue}
                    outputsValue={this.state.outputsValue}
                    guaranteesValue={this.state.guaranteesValue}
                    setGuaranteesValue={this.setGuaranteesValue}
                    setInputsValue={this.setInputsValue}
                    setOutputsValue={this.setOutputsValue}
                    tree={this.state.tree}
                    changeIsOpen={this.changeIsOpen}
                    creationExpanded={this.state.creationExpanded}
                    deleteCreation={deleteCreation}
                    clickedButtonStrix={this.state.clickedButtonStrix}
                    synthesisStrix={this.synthesisStrix}
                    clickedButtonParallel={this.state.clickedButtonParallel}
                    parallelSynthesis={this.parallelSynthesis}
                />
                <div  id="synthesis" className="w-full lg:w-9/12 xl:w-10/12 flex-col mt-5 mx-auto pb-5">
                {
                        this.state.graph ?
                            <div className="px-3 pb-5 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">
                                <div className="w-full border-b-1">
                                    <div className="fs-4 m-2 text-center">
                                        {this.state.clickedButtonStrix ? synthesisInfo.info.buttons.synthesis.strix : synthesisInfo.info.buttons.synthesis.parallel}
                                    </div>
                                </div>
                                <div className="row h-auto">
                                    <div className="m-auto">
                                        {this.state.clickedButtonStrix ?
                                            <Graphviz
                                                dot={this.state.graph}
                                                options={({
                                                    fit: true,
                                                    height: 400,
                                                    width: width / 1.2,
                                                    zoom: true
                                                })}
                                                className="p-4 flex wrap-content justify-center"
                                            />
                                        :
                                            <div className="flex flex-wrap p-4 justify-center">{children}</div>
                                        }
                                    </div>
                                    <div className="row offset-1 text-center py-2 m-auto">
                                        <Link  to="simulation" spy={true} smooth={true}>
                                            <Button
                                                id="simulationButton"
                                                size="lg"
                                                onClick={this.clickSimulation}
                                            >
                                                simulation
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        : null
                }
                </div>
                <div  id="simulation" className="w-full lg:w-9/12 xl:w-10/12 flex-col mt-5 mx-auto pb-5">
                    {
                        this.state.simulation ?
                            <div
                                className="px-3 pb-5 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">
                                <div className="w-full border-b-1">
                                    <div className="fs-4 m-2 text-center">
                                        Simulation
                                    </div>
                                </div>
                                <div className="row h-auto mt-4">
                                    {this.state.clickedButtonStrix ?
                                        <Simulation
                                            name={this.state.nameValue}
                                            mode="strix"
                                        />
                                        : <div className="flex flex-wrap justify-center">
                                            Work in progress
                                        </div>
                                    }
                                </div>
                            </div>
                            : null
                    }
                </div>
                <CustomFooter {...customfooter} />
            </>
        )
    }
}