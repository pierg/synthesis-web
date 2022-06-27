import React from "react";
import PropTypes from "prop-types";

// components
import CustomCardMini from "./CustomCardMini";

export default function Header({ cards, color, states, clickable, onSelectCustomHeader}) {
  const bgColors = {
    light: "bg-blueGray-200",
    dark: "bg-blueGray-800",
    blueGray: "bg-blueGray-500",
    red: "bg-red-500",
    orange: "bg-orange-500",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
    teal: "bg-teal-500",
    lightBlue: "bg-lightBlue-500",
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
  };

  return (
    <>
      <div className={"relative pt-8 pb-12 " + bgColors[color]}>
        <div className="px-12 mx-8 w-40">
          <div>
            <div className="flex flex-wrap justify-center ">
              {cards.map((prop, key) => (
                <div key={key} className="flex-initial w-64 px-3 ">
                  <CustomCardMini
                      {...prop} clickable={clickable} headerKey={key} state={states[key]} onSelectCustomHeader={onSelectCustomHeader}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Header.defaultProps = {
  cards: [],
  color: "blueGray",
};

Header.propTypes = {
  // array of props to pass to the CardStatsMini components
  cards: PropTypes.arrayOf(PropTypes.object),
  color: PropTypes.oneOf([
    "light",
    "dark",
    "blueGray",
    "red",
    "orange",
    "amber",
    "emerald",
    "teal",
    "lightBlue",
    "indigo",
    "purple",
    "pink",
  ]),
};
