import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";

import {
    getArtMeshList,
    getAvailableModels,
    getCurrentModel,
    getHotkeysInCurrentModel,
    getItemList,
    getCurrentModelPhysics,
    getLiveParameterList,
    
} from "./vtube-remote";

import {
    AvailableModelsVariable,
    ArtMeshListVariable,
    CurrentModelVariable,
    HotkeysInCurrentModelVariable,
    ItemListVariable,
    GetCurrentModelPhysicsVariable,
    LiveParameterListVaraible
} from "./types"

export function setupFrontendListeners(
    frontendCommunicator: ScriptModules["frontendCommunicator"]
) {
    frontendCommunicator.onAsync<never, AvailableModelsVariable>(
        "vtube-get-available-models",
        getAvailableModels
    );

    frontendCommunicator.onAsync<never, ArtMeshListVariable>(
        "vtube-get-art-mesh-list",
        getArtMeshList
    );

    frontendCommunicator.onAsync<never, CurrentModelVariable>(
        "vtube-get-current-model",
        getCurrentModel
    );
   
    frontendCommunicator.onAsync<never, HotkeysInCurrentModelVariable>(
        "vtube-get-hotkeys-in-current-model",
        getHotkeysInCurrentModel
    );

    frontendCommunicator.onAsync<never, ItemListVariable>(
        "vtube-get-item-list",
        getItemList
    );

    frontendCommunicator.onAsync<never, GetCurrentModelPhysicsVariable>(
        "vtube-get-current-model-physics",
        getCurrentModelPhysics
    );

    frontendCommunicator.onAsync<never, LiveParameterListVaraible>(
        "vtube-get-live-parameter-list",
        getLiveParameterList
    );
}