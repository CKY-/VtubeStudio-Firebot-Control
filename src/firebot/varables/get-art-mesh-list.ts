import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getArtMeshList } from "../vtube-remote";

export const getArtMeshListVariable: ReplaceVariable = {
    definition: {
        handle: "vtubeArtMeshList",
        description: "An array of Art meshs 'loaded'.",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const artMeshList = await getArtMeshList();
        return JSON.stringify(artMeshList) ?? "Unknown";
    },
};
