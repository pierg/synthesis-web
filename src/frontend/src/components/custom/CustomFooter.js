/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import PropTypes from "prop-types";
import {Modal, ModalBody} from "reactstrap";
import customfooter from "../../_texts/customfooter";


export default function CustomFooter() {

    const [openAboutUs, setOpenAboutUs] = React.useState(false);
    const [openPublication, setOpenPublication] = React.useState(false);

    return (<>
            <footer className="block py-4 w-full absolute bottom-0">
                <div className="container mx-auto px-4">
                    <hr className="mb-4 border-b-1 border-blueGray-200"/>
                    <div className="flex flex-wrap justify-end">
                        <div className="w-full md:w-8/12 px-4">
                            <ul className="flex flex-wrap list-none md:justify-end justify-center">
                                <li>
                                    <a
                                        target="_blank"
                                        href={customfooter.github.href}
                                        rel="noreferrer"
                                        className="text-blueGray-700 hover:no-underline no-underline hover:text-blueGray-900 text-sm focus:outline-none font-semibold block px-3"
                                    > {customfooter.github.title} </a>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setOpenPublication(true)}
                                        className="text-blueGray-700 hover:text-blueGray-900 text-sm font-semibold block px-3"
                                    > {customfooter.publications.title} </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setOpenAboutUs(true)}
                                        className="text-blueGray-700 hover:text-blueGray-900 text-sm font-semibold block px-3"
                                    > {customfooter.aboutUs.title} </button>
                                </li>


                            </ul>
                            <Modal
                                isOpen={openPublication}
                                toggle={() => setOpenPublication(false)}
                                className={"custom-modal-dialog lg:c-m-w-50"}
                            >
                                <ModalBody>

                                    <div
                                        className="modal-header justify-content-center font-bold text-2xl uppercase text-blueGray-700">{customfooter.publications.title}
                                    </div>

                                     <ul className="modal-body pb-5 ">
                                    {customfooter.publications.papers.map((prop, key) => (
                                        <li key={key}>
                                            <p>
                                            <a
                                                rel="noreferrer"
                                                target="_blank"
                                                href={prop.href}
                                                className="text-blueGray-700 hover:text-blueGray-900 text-base focus:outline-none font-medium inline-block"
                                            > {prop.title} </a>
                                                </p>
                                            <p className="pl-3 text-base ">{prop.authors}</p>
                                            <p className="pl-3 text-sm">{prop.details}</p>
                                        </li>))}
                                </ul>
                                </ModalBody>
                            </Modal>

                            <Modal
                                isOpen={openAboutUs}
                                toggle={() => setOpenAboutUs(false)}
                                className={"custom-modal-dialog lg:c-m-w-50"}
                            >
                                <ModalBody>
                                    <div
                                        className="modal-header justify-content-center font-bold text-2xl uppercase text-blueGray-700">{customfooter.aboutUs.title}
                                    </div>

                                    <p className="modal-body text-justify font-medium text-lg">{customfooter.aboutUs.text}</p>
                                </ModalBody>
                            </Modal>
                        </div>
                    </div>
                </div>
            </footer>
        </>);
}

CustomFooter.defaultProps = {
    copyright: {}, links: [],
};

CustomFooter.propTypes = {
    // properties to pass to the link object
    // that sits on the left of the footer
    // if you pass a prop named to, the link will be
    // generated using Link from react-router-dom
    copyright: PropTypes.object, // array of properties to pass to the link object
    // that are on the right side of the footer
    // if you pass a prop named to, the link will be
    // generated using Link from react-router-dom
    links: PropTypes.arrayOf(PropTypes.object),
};
