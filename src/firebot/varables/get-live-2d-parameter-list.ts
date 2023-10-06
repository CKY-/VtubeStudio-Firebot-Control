import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getLive2DParameterList } from "../vtube-remote";

export const getLive2DParameterListVarable: ReplaceVariable = {
    definition: {
        handle: "vtubeCurrentModel",
        description:
            "An array of Available Models 'loaded'.",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const Live2DParameterList = await getLive2DParameterList();
        return JSON.stringify(Live2DParameterList) ?? "Unknown";
    },
};