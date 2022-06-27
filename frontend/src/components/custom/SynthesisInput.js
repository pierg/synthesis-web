import React from 'react';
import {Input} from "reactstrap";

function SynthesisInput(props) {

    return (<div className="row">
                <div className="col-3 mt-2 fs-5 text-right text-blueGray-500 uppercase font-bold">
                    {props.title}
                </div>
                <div className="col-8 relative">
                    <Input
                        value={props.value}
                        className="border-blueGray-300 text-base text-blueGray-700 relative bg-white rounded-md outline-none focus:ring focus:ring-lightBlue-500 focus:ring-1 focus:border-lightBlue-500 border border-solid transition duration-200  pl-8 textareaResizeNone w-100"
                        onChange={e => props.setValue(e)}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                        }}
                    />
                </div>
            </div>);
}

export default SynthesisInput;