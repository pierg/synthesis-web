/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function CustomFooter({ copyright, links }) {
  return (
    <>
      <footer className="block py-4 w-full absolute bottom-0">
        <div className="container mx-auto px-4">
          <hr className="mb-4 border-b-1 border-blueGray-200" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-center mb-2 md:text-left md:mb-0">
                {copyright && copyright.to && (
                  <Link
                    {...copyright}
                    className="text-sm text-blueGray-500 font-semibold py-1 text-center md:text-left"
                  />
                )}
                {copyright && copyright.to === undefined && (
                  <a
                    {...copyright}
                    className="text-sm text-blueGray-500 font-semibold py-1 text-center md:text-left"
                  />
                )}
              </div>
            </div>
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                {links.map((prop, key) => (
                  <li key={key}>
                    {prop.to && (
                      <Link
                        {...prop}
                        className="text-blueGray-700 hover:text-blueGray-900 text-sm font-semibold block py-1 px-3"
                      />
                    )}
                    {prop.to === undefined && (
                      <a
                        {...prop}
                        className="text-blueGray-700 hover:text-blueGray-900 text-sm font-semibold block py-1 px-3"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

CustomFooter.defaultProps = {
  copyright: {},
  links: [],
};

CustomFooter.propTypes = {
  // properties to pass to the link object
  // that sits on the left of the footer
  // if you pass a prop named to, the link will be
  // generated using Link from react-router-dom
  copyright: PropTypes.object,
  // array of properties to pass to the link object
  // that are on the right side of the footer
  // if you pass a prop named to, the link will be
  // generated using Link from react-router-dom
  links: PropTypes.arrayOf(PropTypes.object),
};
