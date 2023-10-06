import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getLiveParameterList } from "../vtube-remote";

export const getLiveParameterListVarable: ReplaceVariable = {
    definition: {
        handle: "vtubeCurrentModel",
        description:
            "An array of Available Models 'loaded'.",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const LiveParameterList = await getLiveParameterList();
        return JSON.stringify(LiveParameterList) ?? "Unknown";
    },
};