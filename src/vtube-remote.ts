import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { ApiClient } from "vtubestudio";
import { VTUBE_EVENT_SOURCE_ID, ModelLoadedEvent, TrackingStatusChangedEvent, BackgroundChangedEvent, ModelConfigChangedEvent, ModelMovedEvent, ModelOutlineEvent } from "./firebot/constants";
import { logger } from "./logger";
import { WebSocket } from 'ws';

//const WebSocket = require('ws');

let vtube: ApiClient;
let eventManager: ScriptModules["eventManager"];
let connected = false;
export type AvailableModels = Record<number, {
    numberOfModels: number;
    availableModels: {
        modelLoaded: boolean;
        modelName: string;
        modelID: string;
        vtsModelName: string;
        vtsModelIconName: string;
    }[]
}>;

export let availableModels: AvailableModels;
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
    }
) {
    eventManager = modules.eventManager;
    maintainConnection(ip, port, token, logging, forceConnect);
}

export async function getAvailableModels(): Promise<AvailableModels> {
    availableModels = await vtube.availableModels();
    return availableModels;
}


let reconnectTimeout: NodeJS.Timeout | null = null;
let isForceClosing = false;
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
                token = authenticationToken;
                return;
            }

            function getAuthToken(this: string) {
                return token;
            }

            vtube = new ApiClient({
                authTokenGetter: getAuthToken,
                authTokenSetter: setAuthToken,
                pluginName: "FireBotContol",
                pluginDeveloper: "CKY",
                webSocketFactory: (url: any) => new WebSocket(url),
                url: `ws://${ip}:${port}`,
                port
            });

            logger.info("Successfully connected to VtubeStudo.");

            connected = vtube.isConnected;

            // setupRemoteListeners();

            vtube.on("connect", async () => {
                const stats = await vtube.statistics()
                logger.debug(`Connected to VTube Studio v${stats.vTubeStudioVersion}`)
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
                    logger.debug("modelMoved",data)
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
