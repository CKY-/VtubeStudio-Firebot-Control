import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getLiveParameterList } from "../vtube-remote";

export const getLiveParameterListVariable: ReplaceVariable = {
    definition: {
        handle: "vtubeLiveParameterListVariable",
        description: "An array of Live 2d Parameters 'loaded'.",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const LiveParameterList = await getLiveParameterList();
        return JSON.stringify(LiveParameterList) ?? "Unknown";
    },
};