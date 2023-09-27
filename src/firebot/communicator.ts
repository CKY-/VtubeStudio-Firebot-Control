import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import {
    //  getAllSources,
    // getSceneList,
    // getSceneCollectionList,
    getAvailableModels,
    AvailableModels,
    // OBSSource,
    // getSourcesWithFilters,
    // getAudioSources,
} from "../vtube-remote";

export function setupFrontendListeners(
    frontendCommunicator: ScriptModules["frontendCommunicator"]
) {
    frontendCommunicator.onAsync<never, AvailableModels>(
        "vtube-get-available-models",
        getAvailableModels
    );
    /*
    frontendCommunicator.onAsync<never, string[]>(
        "obs-get-scene-list",
        getSceneList
    );

    frontendCommunicator.onAsync<never, string[]>(
        "obs-get-scene-collection-list",
        getSceneCollectionList
    );

    frontendCommunicator.onAsync<never, Array<OBSSource>>(
        "obs-get-sources-with-filters",
        getSourcesWithFilters
    );

    frontendCommunicator.onAsync<never, Array<OBSSource>>(
        "obs-get-audio-sources",
        getAudioSources
    );
    */
}