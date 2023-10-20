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
                    if (data.modelLoaded) {
                        eventManager?.triggerEvent(
                            VTUBE_EVENT_SOURCE_ID,
                            ModelLoadedEvent,
                            {
                                data
                            }
                        );
                    }
                })

                await vtube.events.backgroundChanged.subscribe((data) => {
                    eventManager?.triggerEvent(
                        VTUBE_EVENT_SOURCE_ID,
                        BackgroundChangedEvent,
                        {
                            data
                        }
                    );
                })

                await vtube.events.trackingStatusChanged.subscribe((data) => {
                    eventManager?.triggerEvent(
                        VTUBE_EVENT_SOURCE_ID,
                        TrackingStatusChangedEvent,
                        {
                            data
                        }
                    );
                })

                await vtube.events.modelConfigChanged.subscribe((data) => {
                    eventManager?.triggerEvent(
                        VTUBE_EVENT_SOURCE_ID,
                        ModelConfigChangedEvent,
                        {
                            data
                        }
                    );
                })

                await vtube.events.modelMoved.subscribe((data) => {
                    logger.debug("modelMoved", data)
                    eventManager?.triggerEvent(
                        VTUBE_EVENT_SOURCE_ID,
                        ModelMovedEvent,
                        {
                            data
                        }
                    );
                })

                await vtube.events.modelOutline.subscribe((data) => {
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
