import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getCurrentModelPhysics } from "../vtube-remote";

export const getCurrentModelPhysicsVariable: ReplaceVariable = {
    definition: {
        handle: "vtubegetCurrentModelPhysics",
        description: "An array of Physics In Current Model.",
        possibleDataOutput: ["text"],
    },
    evaluator: async () => {
        const currentModelPhysics = await getCurrentModelPhysics();
        return JSON.stringify(currentModelPhysics)?? "Unknown";
    },
};
