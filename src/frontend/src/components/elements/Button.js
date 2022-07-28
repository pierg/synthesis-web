import React from "react";
import PropTypes from "prop-types";

const Button = React.forwardRef(
  ({ outline, worldModeling, size, color, children, fullWidth, contracts, ...rest }, ref) => {
    const sizes = {
      sm: "text-xs px-3 py-2 shadow-sm hover:shadow-md rounded-md",
      regular: "text-sm px-6 py-2 shadow hover:shadow-lg rounded-md",
      regular2: "w-100 text-sm px-6 py-2 shadow hover:shadow-lg rounded-md",
      lg: "text-sm px-6 py-3 shadow-md hover:shadow-lg rounded-lg ",
      customLg: "text-sm px-6 py-3 shadow-md hover:shadow-lg rounded-lg transition ease-in-out duration-400 hover:custom-transform",
      xl: "text-sm px-10 py-3 shadow-md hover:shadow-lg rounded-lg",
      worldModeling: "w-64 text-sm py-1 shadow-md hover:shadow-lg rounded-lg whitespace-nowrap break-all border-1"
    };
    const colors = {
      facebook:
        "text-white bg-facebook-regular border-facebook-regular active:bg-facebook-active active:border-facebook-active",
      "facebook-outline":
        "text-facebook-regular border-facebook-regular active:bg-facebook-active active:border-facebook-active active:text-white",
      twitter:
        "text-white bg-twitter-regular border-twitter-regular active:bg-twitter-active active:border-twitter-active",
      "twitter-outline":
        "text-twitter-regular border-twitter-regular active:bg-twitter-active active:border-twitter-active active:text-white",
      instagram:
        "text-white bg-instagram-regular border-instagram-regular active:bg-instagram-active active:border-instagram-active",
      "instagram-outline":
        "text-instagram-regular border-instagram-regular active:bg-instagram-active active:border-instagram-active active:text-white",
      github:
        "text-white bg-github-regular border-github-regular active:bg-github-active active:border-github-active",
      "github-outline":
        "text-github-regular border-github-regular active:bg-github-active active:border-github-active active:text-white",
      pinterest:
        "text-white bg-pinterest-regular border-pinterest-regular active:bg-pinterest-active active:border-pinterest-active",
      "pinterest-outline":
        "text-pinterest-regular border-pinterest-regular active:bg-pinterest-active active:border-pinterest-active active:text-white",
      youtube:
        "text-white bg-youtube-regular border-youtube-regular active:bg-youtube-active active:border-youtube-active",
      "youtube-outline":
        "text-youtube-regular border-youtube-regular active:bg-youtube-active active:border-youtube-active active:text-white",
      vimeo:
        "text-white bg-vimeo-regular border-vimeo-regular active:bg-vimeo-active active:border-vimeo-active",
      "vimeo-outline":
        "text-vimeo-regular border-vimeo-regular active:bg-vimeo-active active:border-vimeo-active active:text-white",
      slack:
        "text-white bg-slack-regular border-slack-regular active:bg-slack-active active:border-slack-active",
      "slack-outline":
        "text-slack-regular border-slack-regular active:bg-slack-active active:border-slack-active active:text-white",
      dribbble:
        "text-white bg-dribbble-regular border-dribbble-regular active:bg-dribbble-active active:border-dribbble-active",
      "dribbble-outline":
        "text-dribbble-regular border-dribbble-regular active:bg-dribbble-active active:border-dribbble-active active:text-white",
      reddit:
        "text-white bg-reddit-regular border-reddit-regular active:bg-reddit-active active:border-reddit-active",
      "reddit-outline":
        "text-reddit-regular border-reddit-regular active:bg-reddit-active active:border-reddit-active active:text-white",
      tumblr:
        "text-white bg-tumblr-regular border-tumblr-regular active:bg-tumblr-active active:border-tumblr-active",
      "tumblr-outline":
        "text-tumblr-regular border-tumblr-regular active:bg-tumblr-active active:border-tumblr-active active:text-white",
      linkedin:
        "text-white bg-linkedin-regular border-linkedin-regular active:bg-linkedin-active active:border-linkedin-active",
      "linkedin-outline":
        "text-linkedin-regular border-linkedin-regular active:bg-linkedin-active active:border-linkedin-active active:text-white",
      white:
        "text-blueGray-800 bg-white border-white active:bg-blueGray-100 active:border-blueGray-100",
      "white-outline":
        "text-white border-white active:bg-blueGray-100 active:border-blueGray-100 active:text-blueGray-800",
      light:
        "text-blueGray-800 bg-blueGray-200 border-blueGray-200 active:bg-blueGray-300 active:border-blueGray-300",
      "light-outline":
        "text-blueGray-200 border-blueGray-200 active:bg-blueGray-300 active:border-blueGray-300 active:text-blueGray-800",
      dark:
        "text-white bg-blueGray-800 border-blueGray-800 active:bg-blueGray-900 active:border-blueGray-900",
      "dark-outline":
        "text-blueGray-800 border-blueGray-800 active:bg-blueGray-900 active:border-blueGray-900 active:text-white",
      blueGray:
        "text-white bg-blueGray-500 border-blueGray-500 active:bg-blueGray-600 active:border-blueGray-600",
      "blueGray-outline":
        "text-blueGray-500 border-blueGray-500 active:bg-blueGray-600 active:border-blueGray-600 active:text-white",
      red:
        "text-white bg-red-500 border-red-500 active:bg-red-600 active:border-red-600",
      "red-outline":
        "text-red-500 border-red-500 active:bg-red-600 active:border-red-600 active:text-white",
      orange:
        "text-white bg-orange-500 border-orange-500 active:bg-orange-600 active:border-orange-600",
      "orange-outline":
        "text-orange-500 border-orange-500 active:bg-orange-600 active:border-orange-600 active:text-white",
      amber:
        "text-white bg-amber-500 border-amber-500 active:bg-amber-600 active:border-amber-600",
      "amber-outline":
        "text-amber-500 border-amber-500 active:bg-amber-600 active:border-amber-600 active:text-white",
      emerald:
        "text-white bg-emerald-500 border-emerald-500 active:bg-emerald-600 active:border-emerald-600",
      "emerald-outline":
        "text-emerald-500 border-emerald-500 active:bg-emerald-600 active:border-emerald-600 active:text-white",
      teal:
        "text-white bg-teal-500 border-teal-500 active:bg-teal-600 active:border-teal-600",
      "teal-outline":
        "text-teal-500 border-teal-500 active:bg-teal-600 active:border-teal-600 active:text-white",
      lightBlue:
        "text-white bg-lightBlue-500 border-lightBlue-500 active:bg-lightBlue-600 active:border-lightBlue-600",
      "lightBlue-outline":
        "text-lightBlue-500 border-lightBlue-500 active:bg-lightBlue-600 active:border-lightBlue-600 active:text-white",
      indigo:
        "text-white bg-indigo-500 border-indigo-500 active:bg-indigo-600 active:border-indigo-600",
      "indigo-outline":
        "text-indigo-500 border-indigo-500 active:bg-indigo-600 active:border-indigo-600 active:text-white",
      purple:
        "text-white bg-purple-500 border-purple-500 active:bg-purple-600 active:border-purple-600",
      "purple-outline":
        "text-purple-500 border-purple-500 active:bg-purple-600 active:border-purple-600 active:text-white",
      pink:
        "text-white bg-pink-500 border-pink-500 active:bg-pink-600 active:border-pink-600",
      "pink-outline":
        "text-pink-500 border-pink-500 active:bg-pink-600 active:border-pink-600 active:text-white",
      gray:
        "text-black bg-blueGray-200 border-blueGray-200 active:bg-blueGray-300 active:border-blueGray-300",
      "gray-outline":
        "text-lightBlue-700 border-blueGray-200 active:bg-blueGray-300 active:border-blueGray-300 active:text-white",
    };
    let className =
      "inline-block outline-none focus:outline-none align-middle transition-all duration-150 ease-in-out uppercase border border-solid font-bold last:mr-0 mr-2 ";
    className = className + " " + colors[color + (outline ? "-outline" : "")];
    className = className + " " + sizes[size];

    if(contracts) {
      return (<></>);
    }else{
    if (fullWidth) {
      className = className + " w-full text-center";
    }
    return rest.hasOwnProperty("href") ? (
      <a {...rest} ref={ref} className={className}>
        {children}
      </a>
    ) : (
      <button {...rest} ref={ref} className={className}>
        {children}
      </button>
    );
  }
    }
);
Button.defaultProps = {
  outline: false,
  color: "blueGray",
  fullWidth: false,
  size: "regular",
};
Button.propTypes = {
  size: PropTypes.oneOf(["sm", "lg", "customLg", "regular", "xl", "worldModeling"]),
  outline: PropTypes.bool,
  children: PropTypes.node,
  fullWidth: PropTypes.bool,
  color: PropTypes.oneOf([
    "facebook",
    "twitter",
    "instagram",
    "github",
    "pinterest",
    "youtube",
    "vimeo",
    "slack",
    "dribbble",
    "reddit",
    "tumblr",
    "linkedin",
    "white",
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
    "gray",
  ]),
};

export default Button;
