import React from "react";
import {Link} from 'react-scroll';
import '@blueprintjs/core/lib/css/blueprint.css';
import { Graphviz } from 'graphviz-react';
import {toast} from "react-toastify";

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
        //-- form
        nameValue : "",
        assumptionsValue : "",
        guaranteesValue : "",
        inputsValue : "",
        outputsValue : "",

        //-- tree
        triggerExample : true,
        tree : [],
        yourCreation : [],
        isOpen : [],
        modeToDelete : null,
        creationToDelete : null,
        triggerDelete : false,
        parallelExpanded : false,
        strixExpanded : false,

        //-- save
        triggerSynthesis : false,
        toastLoading : null,
        clickedButtonStrix : false,
        clickedButtonParallel : false,
        graph : null,
        simulation : false,
    }

    // -------------------- FORM --------------------
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

    setTriggerExample = (bool) => {
        this.setState({
            triggerExample: bool
        })
    }

    // -------------------- TREE --------------------
    changeIsOpen = ({e}) => {
        e.isExpanded = !e.isExpanded
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
            if(e.label === "parallel") {
                this.setState({
                    parallelExpanded : !this.state.parallelExpanded,
                })
            }
            else if(e.label === "strix") {
                this.setState({
                    strixExpanded : !this.state.strixExpanded,
                })
            }
        }
        this.setState({
        })
    }

    initChildNode = (node,i,j) => {
        let childNode = {}
        childNode.id = i+"_"+j
        childNode.label = node.id
        childNode.assumptions = node.assumptions
        childNode.guarantees = node.guarantees
        childNode.inputs = node.inputs
        childNode.outputs = node.outputs
        return childNode
    }

    setTree = (tree) => {
        let treeTmp = []
        let yourCreationTmp = []
        let keys = Object.keys(tree).sort()
        let node
        for(let i=0;i<keys.length;i++) {
            node = {}
            node.id = i
            node.label = keys[i]
            node.icon = "folder-close"
            node.isExpanded = false
            node.childNodes = []

            for(let j=0;j<tree[keys[i]].length;j++) {
                node.childNodes[j] = this.initChildNode(tree[keys[i]][j],i,j)
            }

            if(keys[i] === "strix" || keys[i] === "parallel") {
                yourCreationTmp.push(node)
            }
            else {
                treeTmp.push(node)
            }
        }

        this.setState({
            tree : treeTmp,
            yourCreation : yourCreationTmp,
            parallelExpanded : false,
            strixExpanded : false,
        })
    }

    deleteCreationClick = (mode,nodeId) => {
        this.setState({
            modeToDelete: mode,
            creationToDelete: this.state.yourCreation[mode].childNodes[nodeId]
        })
        this.setTriggerDelete(true)
    }

    setTriggerDelete = (bool) => {
        this.setState({
            triggerDelete: bool
        })
    }

    deletedDone = () => {
        this.setTriggerExample(true)
    }

    // -------------------- SAVE --------------------
    setTriggerSynthesis = (bool) => {
        this.setState({
            triggerSynthesis: bool
        })
    }

    synthesisWorking = () => {
        const toastId = toast.loading('Synthesis is working, please wait')
        this.setState({
            toastLoading: toastId
        })
    }

    synthesisStrix = () => {
        this.synthesisWorking()
        this.setState({
            clickedButtonStrix : true,
            clickedButtonParallel : false,
            triggerSynthesis : true,
            graph: null,
            simulation: false
        })
    }

    parallelSynthesis = () => {
        this.synthesisWorking()
        this.setState({
            clickedButtonStrix : false,
            clickedButtonParallel : true,
            triggerSynthesis : true,
            graph : null,
            simulation: false
        })
    }

    setGraph = (graph) => {
        const toastId = this.state.toastLoading
        toast.dismiss(toastId)
        this.setState({
            graph : graph,
            toastLoading: null,
            triggerExample: true,
        })
    }

    clickSimulation = () => {
        this.setState({
            simulation: true
        })
    }

    render(){
        const deleteCreation = [];
        if(this.state.yourCreation.length === 2) {
            let cpt = 2
            //delete for parallel
            if(this.state.parallelExpanded) {
                for (let i = 1; i < this.state.yourCreation[0].childNodes.length+1; i += 1) {
                    deleteCreation.push(
                        <button
                            key={i}
                            style={{top: (i*30)+"px", right: "10px", height: "30px", width: "30px"}}
                            className="absolute text-right"
                            onClick={() => this.deleteCreationClick(0,i-1)}
                        >
                            <span className="fas fa-trash"></span>
                        </button>
                    );
                    cpt = i
                }
            }
            //delete for strix
            if(this.state.strixExpanded) {
                for (let i = cpt; i < this.state.yourCreation[1].childNodes.length + cpt; i += 1) {
                    deleteCreation.push(
                        <button
                            key={i}
                            style={{top: (i * 30) + "px", right: "10px", height: "30px", width: "30px"}}
                            className="absolute text-right"
                            onClick={() => this.deleteCreationClick(1,i-cpt)}
                        >
                            <span className="fas fa-trash"></span>
                        </button>
                    );
                }
            }
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
                <SocketDeleteSynthesis
                    trigger={this.state.triggerDelete}
                    setTrigger={this.setTriggerDelete}
                    deletedDone={this.deletedDone}
                    modeToDelete={this.state.modeToDelete}
                    creation={this.state.creationToDelete}
                />
                <SocketGetSynthesis
                    trigger={this.state.triggerSynthesis}
                    setTrigger={this.setTriggerSynthesis}
                    strix={this.state.clickedButtonStrix}
                    parallel={this.state.clickedButtonParallel}
                    name={this.state.nameValue}
                    assumptions={this.state.assumptionsValue.split("\n")}
                    guarantees={this.state.guaranteesValue.split("\n")}
                    inputs={this.state.inputsValue.replaceAll(" ","").split(",")}
                    outputs={this.state.outputsValue.replaceAll(" ","").split(",")}
                    setGraph={this.setGraph}
                />
                <div className="relative py-8 bg-emerald-400 ">
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
                    guaranteesValue={this.state.guaranteesValue}
                    setGuaranteesValue={this.setGuaranteesValue}
                    inputsValue={this.state.inputsValue}
                    setInputsValue={this.setInputsValue}
                    outputsValue={this.state.outputsValue}
                    setOutputsValue={this.setOutputsValue}
                    tree={this.state.tree}
                    yourCreation={this.state.yourCreation}
                    deleteCreation={deleteCreation}
                    changeIsOpen={this.changeIsOpen}
                    saveFormula={this.saveFormula}
                    parallelSynthesis={this.parallelSynthesis}
                    synthesisStrix={this.synthesisStrix}
                />
                {
                    this.state.graph ?
                    <div className="w-full lg:w-9/12 xl:w-10/12 flex-col mt-5 mx-auto">
                        <div className="px-3 pb-5 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">
                            <div className="w-full border-b-1">
                                <div className="fs-4 m-2 text-center">
                                    {this.state.clickedButtonStrix  ? synthesisInfo.info.buttons.synthesis.strix : synthesisInfo.info.buttons.synthesis.parallel}
                                </div>
                            </div>
                            <div className="row h-auto">
                                <div className="m-auto">
                                    {this.state.clickedButtonStrix  ?
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
                    </div>
                    : null
                }
                <div id="synthesis"></div>
                {
                    this.state.simulation ?
                        <div  id="simulation" className="w-full lg:w-9/12 xl:w-10/12 flex-col mt-5 mx-auto">
                            <div
                                className="px-3 pb-5 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">
                                <div className="w-full border-b-1">
                                    <div className="fs-4 m-2 text-center">
                                        Simulation
                                    </div>
                                </div>
                                <div className="row h-auto mt-4">
                                    {this.state.clickedButtonStrix  ?
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
                        </div>
                    : null
                }
                <div className="h-32"></div>
                <CustomFooter {...customfooter} />
            </>
        )
    }
}
