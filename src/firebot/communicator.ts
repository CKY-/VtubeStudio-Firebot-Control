import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";

import {
    getArtMeshList,
    getAvailableModels,
    getCurrentModel,
    getHotkeysInCurrentModel,
    getItemList,
    getCurrentModelPhysics,
    getLive2DParameterList
} from "./vtube-remote";

import {
    AvailableModelsVariable,
    ArtMeshListVariable,
    CurrentModelVariable,
    HotkeysInCurrentModelVariable,
    ItemListVariable,
    GetCurrentModelPhysicsVariable,
    Live2DParameterListVaraible
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

    frontendCommunicator.onAsync<never, Live2DParameterListVaraible>(
        "vtube-get-live-2D-parameter-list",
        getLive2DParameterList
    );
}