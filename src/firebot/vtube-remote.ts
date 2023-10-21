import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { ApiClient, IClientCallConfig } from "vtubestudio";
import * as WebSocket from "ws";

import {
    AvailableModelsVariable,
    ArtMeshListVariable,
    HotkeysInCurrentModelVariable,
    CurrentModelVariable,
    ItemListVariable,
    GetCurrentModelPhysicsVariable,
    LiveParameterListVaraible,
    HotkeyTriggerEffect,
    ExpressionStateEffect,
    ExpressionActivationEffect,
    movedItems,
    unloadedItems
} from "./types";

import {
    VTUBE_EVENT_SOURCE_ID,
    ModelLoadedEvent,
    TrackingStatusChangedEvent,
    BackgroundChangedEvent,
    ModelConfigChangedEvent,
    ModelMovedEvent,
    ModelOutlineEvent
} from "./constants";

import { logger } from "../logger";


let fs: ScriptModules["fs"]
let vtube: ApiClient;
let eventManager: ScriptModules["eventManager"];
let logging:boolean;
let connected = false;
let reconnectTimeout: NodeJS.Timeout | null = null;
let isForceClosing = false;

export let savedToken: string;
export let availableModels: AvailableModelsVariable;
export let artMeshList: ArtMeshListVariable;
export let currentModel: CurrentModelVariable;
export let hotkeysInCurrentModel: HotkeysInCurrentModelVariable;
export let hotkeyTrigger: HotkeyTriggerEffect;
export let itemListVariable: ItemListVariable;
export let currentModelPhysicsVariable: GetCurrentModelPhysicsVariable
export let liveParameterList: LiveParameterListVaraible
export let expressionActivation: ExpressionActivationEffect

export function initRemote(
    {
        ip,
        port,
        token,
        logging,
        forceConnect,
    }: {
        ip: string;
        port: number;
        token: string;
        logging: boolean;
        forceConnect?: boolean;
    },
    modules: {
        eventManager: ScriptModules["eventManager"];
        fs: ScriptModules["fs"]
    }
) {
    eventManager = modules.eventManager;
    fs = modules.fs;
    logging = logging ?? false
    maintainConnection(ip, port, token, logging, forceConnect);
}

export async function getAvailableModels(): Promise<AvailableModelsVariable> {
    availableModels = await vtube.availableModels();
    if (logging) {
        logger.debug("Vtube-availableModels: ", availableModels)
    }
    return availableModels;
}

export async function getArtMeshList(): Promise<ArtMeshListVariable> {
    artMeshList = await vtube.artMeshList();
    if (logging) {
        logger.debug("Vtube-artMeshList: ", artMeshList)
    }
    return artMeshList;
}

export async function getCurrentModel(): Promise<CurrentModelVariable> {
    currentModel = await vtube.currentModel();
    if (logging) {
        logger.debug("Vtube-currentModel: ", currentModel)
    }
    return currentModel;
}

export async function getCurrentModelPhysics(): Promise<GetCurrentModelPhysicsVariable> {
    currentModelPhysicsVariable = await vtube.getCurrentModelPhysics();
    if (logging) {
        logger.debug("Vtube-currentModelPhysicsVariable: ", currentModelPhysicsVariable)
    }
    return currentModelPhysicsVariable;
}

export async function getHotkeysInCurrentModel(): Promise<HotkeysInCurrentModelVariable> {
    hotkeysInCurrentModel = await vtube.hotkeysInCurrentModel();
    if (logging) {
        logger.debug("Vtube-hotkeysInCurrentModel: ", hotkeysInCurrentModel)
    }
    return hotkeysInCurrentModel;
}

export async function getLiveParameterList(): Promise<LiveParameterListVaraible> {
    liveParameterList = await vtube.live2DParameterList();
    if (logging) {
        logger.debug("Vtube-liveParameterList: ", liveParameterList)
    }
    return liveParameterList;
}

export async function getItemList(itemfiles = true, spots = true, inScene = true, fileName = "", instanceID = ""): Promise<ItemListVariable> {
    let data = {
        includeAvailableItemFiles: itemfiles,
        includeAvailableSpots: spots,
        includeItemInstancesInScene: inScene,
        onlyItemsWithFileName: fileName,
        onlyItemsWithInstanceID: instanceID,
    }
    itemListVariable = await vtube.itemList(data);
    logger.error("Items", itemListVariable)
    if (logging) {
        logger.debug("Vtube-itemListVariable: ", itemListVariable)
    }
    return itemListVariable;
}

export async function triggerHotkey(key: string): Promise<HotkeyTriggerEffect> {
    let data: {
        hotkeyID: string;
        itemInstanceID?: string;
    } = {
        hotkeyID: key,
    };

    let config: IClientCallConfig
    let hotkeyTrigger = await vtube.hotkeyTrigger(data, config);
    if (logging) {
        logger.debug("Vtube-hotkeyTrigger: ", hotkeyTrigger)
    }
    return hotkeyTrigger;
}

export async function moveModel(
    timeInSeconds: number,
    valuesAreRelativeToModel: boolean = false,
    positionX?: number,
    positionY?: number,
    rotation?: number,
    size?: number
): Promise<void> {
    let data: {
        timeInSeconds: number;
        valuesAreRelativeToModel: boolean;
        positionX?: number;
        positionY?: number;
        rotation?: number;
        size?: number;
    } = {
        timeInSeconds: timeInSeconds,
        valuesAreRelativeToModel: valuesAreRelativeToModel,
        positionX: positionX,
        positionY: positionY,
        rotation: rotation,
        size: size,
    };

    let config: IClientCallConfig
    let modelMove = await vtube.moveModel(data, config);
    if (logging) {
        logger.debug("Vtube-modelMove: ", modelMove)
    }
    return modelMove;
}

export async function loadModel(modelID: string) {
    let data: {
        modelID: string
    } = {
        modelID: modelID
    }

    let config: IClientCallConfig
    let modelLoad = await vtube.modelLoad(data, config);
    if (logging) {
        logger.debug("Vtube-modelLoad: ", modelLoad)
    }
    return modelLoad;
}

export async function loadItem(
    fileName: string,
    positionX?: number,
    positionY?: number,
    size?: number,
    rotation?: number,
    fadeTime?: number,
    order?: number,
    failIfOrderTaken?: boolean,
    smoothing?: number,
    censored?: boolean,
    flipped?: boolean,
    locked?: boolean,
    unloadWhenPluginDisconnects?: boolean,

): Promise<{ instanceID: string }> {
    let data: {
        fileName: string;
        positionX?: number;
        positionY?: number;
        size?: number;
        rotation?: number;
        fadeTime?: number;
        order?: number;
        failIfOrderTaken?: boolean;
        smoothing?: number;
        censored?: boolean;
        flipped?: boolean;
        locked?: boolean;
        unloadWhenPluginDisconnects?: boolean;
    } = {
        fileName: fileName,
        positionX: positionX,
        positionY: positionY,
        size: size,
        rotation: rotation,
        fadeTime: fadeTime,
        order: order,
        failIfOrderTaken: failIfOrderTaken,
        smoothing: smoothing,
        censored: censored,
        flipped: flipped,
        locked: locked,
        unloadWhenPluginDisconnects: unloadWhenPluginDisconnects,
    };

    let config: IClientCallConfig
    let itemLoad = await vtube.itemLoad(data, config);
    if (logging) {
        logger.debug("Vtube-itemLoad: ", itemLoad)
    }
    return itemLoad;
}

export async function moveItem(
    itemInstanceID: string,
    timeInSeconds?: number,
    fadeMode?: 'linear' | 'easeIn' | 'easeOut' | 'easeBoth' | 'overshoot' | 'zip',
    positionX?: number,
    positionY?: number,
    size?: number,
    rotation?: number,
    order?: number,
    setFlip?: boolean,
    flip?: boolean,
    userCanStop?: boolean,

): Promise<movedItems> {
    // let data: ItemMoveEffect = itemsToMoveInfo
    let data: {
        itemsToMove: {
            itemInstanceID: string,
            timeInSeconds?: number,
            fadeMode?: 'linear' | 'easeIn' | 'easeOut' | 'easeBoth' | 'overshoot' | 'zip',
            positionX?: number,
            positionY?: number,
            size?: number,
            rotation?: number,
            order?: number,
            setFlip?: boolean,
            flip?: boolean,
            userCanStop?: boolean,
        }[]
    } = {
        itemsToMove: [
            {
                itemInstanceID: itemInstanceID,
                timeInSeconds: timeInSeconds,
                fadeMode: fadeMode,
                positionX: positionX,
                positionY: positionY,
                size: size,
                rotation: rotation,
                order: order,
                setFlip: setFlip,
                flip: flip,
                userCanStop: userCanStop,
            }
        ]
    };

    let config: IClientCallConfig
    let itemMove = await vtube.itemMove(data, config);
    if (logging) {
        logger.debug("Vtube-itemMove: ", itemMove)
    }
    return itemMove;
}

export async function unloadItem(unloadAllInScene: boolean = false,
    unloadAllLoadedByThisPlugin: boolean = false,
    allowUnloadingItemsLoadedByUserOrOtherPlugins: boolean = false,
    instanceIDs: string[],
    fileNames: string[]): Promise<unloadedItems> {
    let data: {
        unloadAllInScene: boolean,
        unloadAllLoadedByThisPlugin: boolean,
        allowUnloadingItemsLoadedByUserOrOtherPlugins: boolean,
        instanceIDs: string[],
        fileNames: string[]
    } = {
        unloadAllInScene: unloadAllInScene,
        unloadAllLoadedByThisPlugin: unloadAllLoadedByThisPlugin,
        allowUnloadingItemsLoadedByUserOrOtherPlugins: allowUnloadingItemsLoadedByUserOrOtherPlugins,
        instanceIDs: instanceIDs,
        fileNames: fileNames
    };

    let config: IClientCallConfig
    let unloadedItems = await vtube.itemUnload(data, config);
    if (logging) {
        logger.debug("Vtube-unloadedItems: ", unloadedItems)
    }
    return unloadedItems;
}

export async function expressionState(details: boolean = false, file: string): Promise<ExpressionStateEffect> {
    let data: {
        details: boolean;
        expressionFile?: string;
    };
    data.expressionFile = file;
    data.details = details;
    let config: IClientCallConfig
    let expressionState = await vtube.expressionState(data, config);
    if (logging) {
        logger.debug("Vtube-expressionState: ", expressionState)
    }
    return expressionState
}

export async function triggerExpressionActivation(file: string, active: boolean = false): Promise<void> {
    let data: {
        expressionFile: string;
        active: boolean;
    };
    let config: IClientCallConfig
    let expressionActivation = await vtube.expressionActivation(data, config);
    if (logging) {
        logger.debug("Vtube-expressionActivation: ",expressionActivation)
    }
    return expressionActivation;
}

async function maintainConnection(
    ip: string,
    port: number,
    token: string,
    logging: boolean,
    forceClose = false
) {
    if (forceClose && connected) {
        isForceClosing = true;
        await vtube.disconnect();
        connected = false;
        isForceClosing = false;
    }
    if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
    }
    if (!connected) {
        try {
            if (logging) {
                logger.debug("Trying to connect to VtubeStudo...");
                logger.debug("object", vtube)
                logger.debug("url", `ws://${ip}:${port}`)
                logger.debug("port", port)
            }
            function setAuthToken(authenticationToken: string): Promise<void> {
                fs.writeFileSync(token, authenticationToken, {
                    encoding: "utf-8",
                });
                return;
            }

            function getAuthToken() {
                return fs.readFileSync(token, "utf-8");
            }
            vtube = new ApiClient({
                authTokenGetter: getAuthToken,
                authTokenSetter: setAuthToken,
                pluginName: "VTube FireBot Control",
                pluginDeveloper: "CKY",
                pluginIcon:`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`,
                webSocketFactory: (url: any) => new WebSocket(url),
                url: `ws://${ip}:${port}`,
                port
            });

            logger.info("Successfully connected to VtubeStudo.");

            connected = vtube.isConnected;

            vtube.on("connect", async () => {
                const stats = await vtube.statistics()
                logger.debug(`Connected to VTubeStudio v${stats.vTubeStudioVersion}`)
                console.log('Getting list of available models')
                availableModels = await vtube.availableModels()
                console.log('Adding event callback whenever a model is loaded')
                await vtube.events.modelLoaded.subscribe((data) => {
                    if (logging) {
                        logger.debug("modelLoaded", data)
                    }
                    if (data.modelLoaded) {
                        eventManager?.triggerEvent(
                            VTUBE_EVENT_SOURCE_ID,
                            ModelLoadedEvent,
                            {
                                modelName:  data.modelName,
                                modelID: data.modelID
                            }
                        );
                    }
                })

                await vtube.events.backgroundChanged.subscribe((data) => {
                    if (logging) {
                        logger.debug("backgroundChanged", data)
                    }
                    eventManager?.triggerEvent(
                        VTUBE_EVENT_SOURCE_ID,
                        BackgroundChangedEvent,
                        {
                            backgroundName: data.backgroundName
                        }
                    );
                })

                await vtube.events.trackingStatusChanged.subscribe((data) => {
                    if (logging) {
                        logger.debug("trackingStatusChanged", data)
                    }
                    eventManager?.triggerEvent(
                        VTUBE_EVENT_SOURCE_ID,
                        TrackingStatusChangedEvent,
                        {
                            faceFound: data.faceFound,
                            leftHandFound: data.leftHandFound,
                            rightHandFound: data.rightHandFound
                        }
                    );
                })

                await vtube.events.modelConfigChanged.subscribe((data) => {
                    if (logging) {
                        logger.debug("modelConfigChanged", data)
                    }
                    eventManager?.triggerEvent(
                        VTUBE_EVENT_SOURCE_ID,
                        ModelConfigChangedEvent,
                        {
                            data
                        }
                    );
                })

                await vtube.events.modelMoved.subscribe((data) => {
                    if (logging) {
                        logger.debug("modelMoved", data)
                    }
                    eventManager?.triggerEvent(
                        VTUBE_EVENT_SOURCE_ID,
                        ModelMovedEvent,
                        {
                            modelName: data.modelName,
                            positionX: data.modelPosition.positionX,
                            positionY: data.modelPosition.positionY,
                            size: data.modelPosition.size,
                            rotation: data.modelPosition.rotation
                        }
                    );
                })

                await vtube.events.modelOutline.subscribe((data) => {
                    if (logging) {
                        logger.debug("modelOutline", data)
                    }
                    eventManager?.triggerEvent(
                        VTUBE_EVENT_SOURCE_ID,
                        ModelOutlineEvent,
                        {
                            data
                        }
                    );
                })
            })

            vtube.on("disconnect", () => {
                if (!connected) return;
                connected = false;
                if (isForceClosing) return;
                try {
                    logger.info("VtubeStudo Connection lost, attempting again in 10 secs.");
                    reconnectTimeout = setTimeout(
                        () => maintainConnection(ip, port, token, logging),
                        10000
                    );
                } catch (err) {
                    // silently fail
                }
            });

            vtube.on("error", (err) => {
                logger.error("VtubeStudo Error", err);
            });

        } catch (error) {
            logger.debug("VtubeStudo Failed to connect, attempting again in 10 secs.");
            if (logging) {
                logger.debug(error);
            }
            reconnectTimeout = setTimeout(
                () => maintainConnection(ip, port, token, logging),
                10000
            );
        }
    }
}
