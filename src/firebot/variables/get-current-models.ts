import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getCurrentModel } from "../vtube-remote";

export const getCurrentModelVariable: ReplaceVariable = {
    definition: {
        handle: "vtubeCurrentModelVariable",
        description: "An array of Available Models 'loaded'.",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const currentModel = await getCurrentModel();
        return JSON.stringify(currentModel) ?? "Unknown";
    },
};
