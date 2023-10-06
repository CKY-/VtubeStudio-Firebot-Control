import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getCurrentModel } from "../vtube-remote";

export const getCurrentModelVarable: ReplaceVariable = {
    definition: {
        handle: "vtubeCurrentModel",
        description:
            "An array of Available Models 'loaded'.",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const currentModel = await getCurrentModel();
        return currentModel ?? "Unknown";
    },
};
