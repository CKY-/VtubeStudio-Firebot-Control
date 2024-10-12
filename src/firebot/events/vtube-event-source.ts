import { EventSource } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import {
    VTUBE_EVENT_SOURCE_ID,
    ModelLoadedEvent,
    TrackingStatusChangedEvent,
    BackgroundChangedEvent,
    ModelConfigChangedEvent,
    ModelMovedEvent,
    ModelOutlineEvent, 
    ModelClickedEvent,
    PostProcessingEvent
} from "../constants";

export const VTUBEEventSource: EventSource = {
    id: VTUBE_EVENT_SOURCE_ID,
    name: "VTUBE",
    events: [
        {
            id: ModelLoadedEvent,
            name: "VTUBE Model Loaded",
            description: "When the model is loaded",
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
            name: "VTUBE Model Outline Changed",
            description: "When the outline of the model changes",
            manualMetadata: {},
        },
        {
            id: ModelClickedEvent,
            name: "VTUBE Model Clicked",
            description: "When the Model is clicked",
            manualMetadata: {},
        },
        {
            id: PostProcessingEvent,
            name: "VTUBE Post Processing Changed",
            description: "When the post processing effect system is turned on/off, or a preset is loaded/unloaded",
            manualMetadata: {
                currentOnState: "Test Current On State",
                currentPreset: "Test Current Presets"
            },
        },
    ],
};