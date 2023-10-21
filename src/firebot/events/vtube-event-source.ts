import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import {
    VTUBE_EVENT_SOURCE_ID,
    ModelLoadedEvent,
    TrackingStatusChangedEvent,
    BackgroundChangedEvent,
    ModelConfigChangedEvent,
    ModelMovedEvent,
    ModelOutlineEvent
} from "../constants";
import {
    modeldata,
} from "../types";

let userdata: modeldata
export const VTUBEEventSource: EventSource = {
    id: VTUBE_EVENT_SOURCE_ID,
    name: "VTUBE",
    events: [
        {
            id: ModelLoadedEvent,
            name: "VTUBE Model Loaded",
            description: "When the modle is loaded",
            manualMetadata: {
                modelName: "Test Model Name",
            },
        },
        {
            id: TrackingStatusChangedEvent,
            name: "VTUBE Stats Changed",
            description: "When the tracking stats change",
            manualMetadata: {},
        },
        {
            id: BackgroundChangedEvent,
            name: "VTUBE Background Changed",
            description: "When the background changes",
            manualMetadata: {
                backgroundName: "Test Background Name"
            },
        },
        {
            id: ModelMovedEvent,
            name: "VTUBE Model Moved",
            description: "When the model moves",
            manualMetadata: {
                modelName: "Test Model Name",
                positionX: "Test Model PositionX",
                positionY: "Test Model PositionY",
                rotation: "Test Model RotationX",
                size: "Test Model Size"
            }
        },
        {
            id: ModelConfigChangedEvent,
            name: "VTUBE Model Config Changed",
            description: "When the model config changes",
            manualMetadata: {},
        },
        {
            id: ModelOutlineEvent,
            name: "VTUBE Model Outlin Changed",
            description: "When the outlin of the model chnages",
            manualMetadata: {},
        },
    ],
};