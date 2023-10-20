import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getAvailableModels } from "../vtube-remote";

export const getAvailableModelsVariable: ReplaceVariable = {
    definition: {
        handle: "vtubeAvailableModelsList",
        description: "An array of Available Models 'loaded'.",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const availableModels = await getAvailableModels();
        return JSON.stringify(availableModels) ?? "Unknown";
    },
};
