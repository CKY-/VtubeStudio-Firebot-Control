import { EventFilter } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-filter-manager";
import { VTUBE_EVENT_SOURCE_ID, ModelLoadedEvent, ModelMovedEvent } from "../constants";
import { AvailableModelsVariable } from "../types";

export const ModelNameEventFilter: EventFilter = {
    id: "cky:vtube-model-name-filter",
    name: "Model Name",
    events: [
        { eventSourceId: VTUBE_EVENT_SOURCE_ID, eventId: ModelLoadedEvent },
        { eventSourceId: VTUBE_EVENT_SOURCE_ID, eventId: ModelMovedEvent },
    ],
    description: "Filter on the name of the now active VTube Model",
    valueType: "preset",
    comparisonTypes: ["is", "is not"],
    presetValues: (backendCommunicator, $q) => {
        return $q
            .when(backendCommunicator.fireEventAsync("vtube-get-available-models"))
            .then((models: AvailableModelsVariable) =>
                models.availableModels.map((s) => {
                    console.log(s.modelName)
                    return {
                        value: s.modelName,
                        display: s.modelName,
                    };
                })
            );
    },
    predicate: async ({ comparisonType, value }, { eventMeta }) => {
        const expected = value;
        const actual = eventMeta.modelName;
        console.log(eventMeta)
        switch (comparisonType) {
            case "is":
                return actual === expected;
            case "is not":
                return actual !== expected;
            default:
                return false;
        }
    },
};
