import React from "react";
import Editor from "react-simple-code-editor";
import "../../assets/styles/textEditorStyle.css"

function LTLEdit(props) {
    /**
     * Highlight matching parenthesis in a string
     * @param input
     * @returns {string}
     */
    function highlightParenthesis(input) {
        let out = "";
        let level = 0;
        input.split(/([()])/).forEach((bit) => {
          if (bit === "(") {
            level++; // eslint-disable-next-line
            out=out+"<span class=\""+`l${level}`+"\">"+bit+"</span>";
          } else if (bit === ")") { // eslint-disable-next-line
            out=out+"<span class=\""+`l${level}`+"\">"+bit+"</span>";
            level--;
          } else {
            out=out+bit;
          }
        });
        return out.toString();
    }

    /**
     * Highlight the inputs and outputs contains in a string
     * @param input
     * @returns {string}
     */
    function highlightWords(input) {
        let words = []
        let context = ""
        let output = ""
        let textBefore = ""
        let textAfter = ""

        words = props.inputsValue.replaceAll(" ", "").split(",")
        if (!props.goalEdit)
            words = words.concat(props.outputsValue.replaceAll(" ", "").split(","))
        words = words.filter(n => n)

        const inputTab = input.split(/(\s+)/)
        if (words) {
            for (let i=0; i<inputTab.length; i++) {
                    textBefore = ""
                    textAfter = ""
                    context = inputTab[i]
                    while (context && (context.charAt(0) === "!" || context.charAt(0) === "(")) {
                        textBefore += context.charAt(0)
                        context = context.substring(1)
                    }

                    while (context && (context.charAt(context.length - 1) === ")")) {
                        textAfter += context.charAt(context.length - 1)
                        context = context.substring(0, 1 * context.length - 1)
                    }
                    if (words.includes(context)) {
                        context = "<span class='text-emerald-500'>" + context + "</span>"
                    }

                    output = output + textBefore + context + textAfter
            }
        }
        return output
    }

    /**
     * Highligth LTL operators and symbols in a string
     * @param input
     * @returns {*}
     */
    function highlight (input) {
        const LTL = ["G", "F", "X", "U", "R", "W", "M"]
        const symbols = ["<->","->", "&", "|"]

        for (let i=0; i<LTL.length; i++) {
            input = input.replaceAll(LTL[i],"<strong>"+LTL[i]+"</strong>")
        }
        for (let i=0; i<symbols.length; i++) {
            input = input.replaceAll(symbols[i],"<strong>"+symbols[i]+"</strong>")
        }
        return input
    }

    /**
     * Highlight what needs to be highlight in the textarea and put the line numbers before the text
     * @param input
     * @returns {string}
     */
    function highlightWithLineNumbers (input) {
        input = highlightWords(input)
        input = highlight(input)
        return highlightParenthesis(input)
            .split("\n")
            .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
            .join("\n");
    }

    return(<>
        <Editor
            value={props.value}
            onValueChange={code => props.changeParameter(code)}
            highlight={code => highlightWithLineNumbers(code)}
            padding={10}
            className="editor border-blueGray-300 textareaResizeNone text-blueGray-700 relative bg-white rounded-md outline-none focus:ring focus:ring-lightBlue-500 focus:ring-1 focus:border-lightBlue-500 border border-solid transition duration-200"
            textareaId="codeArea"
            style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: props.size,
                outline: 0,
            }}
            />
    </>);
}

export default LTLEdit;