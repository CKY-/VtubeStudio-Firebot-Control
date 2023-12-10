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
    LiveParameterListVariable,
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
let logging: boolean;
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
export let liveParameterList: LiveParameterListVariable
export let expressionActivation: ExpressionActivationEffect

export function initRemote(
    {
        ip,
        port,
        tokenFile,
        logging,
        forceConnect,
    }: {
        ip: string;
        port: number;
        tokenFile: string;
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
    maintainConnection(ip, port, tokenFile, logging, forceConnect);
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

export async function getLiveParameterList(): Promise<LiveParameterListVariable> {
    liveParameterList = await vtube.live2DParameterList();
    if (logging) {
        logger.debug("Vtube-liveParameterList: ", liveParameterList)
    }
    return liveParameterList;
}

export async function getItemList(itemFiles = true, spots = true, inScene = true, fileName = "", instanceID = ""): Promise<ItemListVariable> {
    let data = {
        includeAvailableItemFiles: itemFiles,
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

export async function expressionState(file: string, details: boolean = false): Promise<ExpressionStateEffect> {
    let data: {
        details: boolean;
        expressionFile?: string;
    } = {
        details: details,
        expressionFile: file
    }
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
    } = {
        expressionFile: file,
        active: active
    }
    let config: IClientCallConfig
    let expressionActivation = await vtube.expressionActivation(data, config);
    if (logging) {
        logger.debug("Vtube-expressionActivation: ", expressionActivation)
    }
    return expressionActivation;
}

async function maintainConnection(
    ip: string,
    port: number,
    tokenFile: string,
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
                logger.debug("Trying to connect to VtubeStudio...");
                logger.debug("object: ", vtube)
                logger.debug("url: ", `ws://${ip}:${port}`)
                logger.debug("port: ", port)
            }

            function setAuthToken(authenticationToken: string): Promise<void> {
                fs.writeFileSync(tokenFile, authenticationToken, {
                    encoding: "utf-8",
                });
                return;
            }

            function getAuthToken() {
                return fs.readFileSync(tokenFile, "utf-8");
            }
            logger.info("populating VtubeStudo.");
            vtube = new ApiClient({
                authTokenGetter: getAuthToken,
                authTokenSetter: setAuthToken,
                pluginName: "VTube FireBot Control",
                pluginDeveloper: "CKY",
                pluginIcon: `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`,
                webSocketFactory: (url: any) => new WebSocket(url),
                url: `ws://${ip}:${port}`,
                port
            });
            logger.info("populated VtubeStudo: ");
            logger.info(JSON.stringify(vtube));
            connected = vtube.isConnected;
            if (connected) {
                logger.info("Successfully connected to VtubeStudo.");
            }

            vtube.on("connect", async () => {
                const stats = await vtube.statistics()
                logger.debug(`Connected to VTubeStudio v${stats.vTubeStudioVersion}`)
                console.log('Getting list of available models')
                availableModels = await vtube.availableModels()
                console.log('Adding event callback whenever a model is loaded')
                await vtube.events.modelLoaded.subscribe((data) => {
                    if (logging) {
                        //logger.debug("modelLoaded", data)
                    }
                    if (data.modelLoaded) {
                        eventManager?.triggerEvent(
                            VTUBE_EVENT_SOURCE_ID,
                            ModelLoadedEvent,
                            {
                                modelName: data.modelName,
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
                        () => maintainConnection(ip, port, tokenFile, logging),
                        10000
                    );
                } catch (err) {
                    // silently fail
                }
            });

            vtube.on("error", (err) => {
                logger.error("VtubeStudo Error", err);
            });
            logger.debug("VtubeStudo end of try");
        } catch (error) {
            logger.debug("VtubeStudo Failed to connect, attempting again in 10 secs.");
            if (logging) {
                logger.debug(error);
            }
            reconnectTimeout = setTimeout(
                () => maintainConnection(ip, port, tokenFile, logging),
                10000
            );
        }
    }
}
