import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { getItemList } from "../vtube-remote";

export const getItemListVariable: ReplaceVariable = {
    definition: {
        handle: "vtubeAvailableItemsList",
        description:
            "An array of Available Items 'loaded'.",
        possibleDataOutput: ["text"],
        examples: [
            {
                usage: 'vtubeAvailableItemsList[includeAvailableItemFiles]',
                description: "An array of Available Items 'loaded'."
            },
            {
                usage: 'vtubeAvailableItemsList[includeAvailableItemFiles, includeAvailableSpots]',
                description: "An array of Available Items 'loaded'."
            }, 
            {
                usage: 'vtubeAvailableItemsList[includeAvailableItemFiles, includeAvailableSpots, includeItemInstancesInScene]',
                description: "An array of Available Items 'loaded'."
            },
            {
                usage: 'vtubeAvailableItemsList[includeAvailableItemFiles, includeAvailableSpots, includeItemInstancesInScene, onlyItemsWithFileName]',
                description: "An array of Available Items 'loaded'."
            },
            {
                usage: 'vtubeAvailableItemsList[includeAvailableItemFiles, includeAvailableSpots, includeItemInstancesInScene, onlyItemsWithFileName, onlyItemsWithInstanceID]',
                description: "An array of Available Items 'loaded'."
            }
        ],
    },
    evaluator: async (_, includeAvailableItemFiles = true, includeAvailableSpots=true, includeItemInstancesInScene=true, onlyItemsWithFileName="", onlyItemsWithInstanceID="" ) => {
        const itemList = await getItemList(includeAvailableItemFiles, includeAvailableSpots, includeItemInstancesInScene, onlyItemsWithFileName, onlyItemsWithInstanceID);
        return itemList ?? "Unknown";
    },
};
