import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getHotkeysInCurrentModel } from "../vtube-remote";

export const getHotkeysInCurrentModelVaraible: ReplaceVariable = {
    definition: {
        handle: "vtubeHotkeysInCurrentModel",
        description: "An array of Hotkeys In Current Model.",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const hotkeysInCurrentModel = await getHotkeysInCurrentModel();
        return JSON.stringify(hotkeysInCurrentModel) ?? "Unknown";
    },
};
