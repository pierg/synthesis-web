import React from "react";
import PropTypes from "prop-types";

export default function CustomCardMini({
  statTitle,
  statIconName,
  statIconColor,
  state,
  headerKey,
  clickable,
  onSelectCustomHeader,
}) {
  let color = state ? "text-blueGray-700" : "text-blueGray-300";
  let iconColor = state ? statIconColor : "bg-blueGray-200";
  let mouseHover = clickable ? "cursor-pointer" : "cursor-auto";

  return (
    <>
      <div onClick={() => onSelectCustomHeader(headerKey, clickable, statTitle)} className={"relative flex justify-center break-words bg-white rounded-lg mb-6 shadow-lg text-center " + mouseHover}>
        <div className="p-3 ">
          <div className="flex flex-row ">
            <div className="pr-4 flex justify-center items-center ">
              <span className={"font-bold text-base uppercase " + color}>
                {statTitle}
              </span>
            </div>
            <div className="relative w-auto ">
              <div
                className={
                  "text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full " +
                  iconColor
                }
              >
                <i className={statIconName} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

CustomCardMini.defaultProps = {
  statArrow: "up",
};

CustomCardMini.propTypes = {
  statSubtitle: PropTypes.string,
  statTitle: PropTypes.string,
  statArrow: PropTypes.oneOf(["up", "down"]),
  statPercent: PropTypes.string,
  // can be any of the text color utilities
  // from tailwindcss
  statPercentColor: PropTypes.string,
  statDescripiron: PropTypes.string,
  statIconName: PropTypes.string,
  // can be any of the background color utilities
  // from tailwindcss
  statIconColor: PropTypes.string,
};
