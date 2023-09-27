import { initRemote } from "../vtube-remote";
import { TypedEmitter } from "tiny-typed-emitter";
import { EventManager } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import {
    Integration,
    IntegrationController,
    IntegrationData,
    IntegrationEvents,
} from "@crowbartools/firebot-custom-scripts-types";

type vTubeSettings = {
    websocketSettings: {
        ipAddress: string;
        port: number;

    };
    misc: {
        logging: boolean;
        token: string;
    };
};

class IntegrationEventEmitter extends TypedEmitter<IntegrationEvents> { }

class vTubeIntegration
    extends IntegrationEventEmitter
    implements IntegrationController<vTubeSettings>
{
    connected = false;

    constructor(private readonly eventManager: EventManager) {
        super();
    }

    private setupConnection(settings?: vTubeSettings) {
        if (!settings) {
            return;
        }
        const {
            websocketSettings: { ipAddress, port},
            misc: {logging, token},
        } = settings;
        initRemote(
            {
                ip: ipAddress,
                port,
                logging,
                token,
                forceConnect: true,
            },
            {
                eventManager: this.eventManager,
            }
        );
    }

    init(
        linked: boolean,
        integrationData: IntegrationData<vTubeSettings>
    ): void | PromiseLike<void> {
        this.setupConnection(integrationData.userSettings);
    }

    onUserSettingsUpdate?(
        integrationData: IntegrationData<vTubeSettings>
    ): void | PromiseLike<void> {
        this.setupConnection(integrationData.userSettings);
    }
}

export const getVTubeIntegration = (
    eventManager: EventManager
): Integration<vTubeSettings> => ({
    definition: {
        id: "VTubeStudio",
        name: "VTubeStudio",
        description:
            "Connect to VTubeStudio to allow Firebot to change scenes, toggle sources and filters, and much more.",
        linkType: "none",
        configurable: true,
        connectionToggle: false,
        settingCategories: {
            websocketSettings: {
                title: "Websocket Settings",
                sortRank: 1,
                settings: {
                    ipAddress: {
                        title: "IP Address",
                        description:
                            "The ip address of the computer running vtube. Use 'localhost' for the same computer.",
                        type: "string",
                        default: "localhost",
                    },
                    port: {
                        title: "Port",
                        description:
                            "Port the Vtube Websocket is running on. Default is 8001.",
                        type: "number",
                        default: 8001,
                    },

                },
            },
            misc: {
                title: "Misc",
                sortRank: 2,
                settings: {
                    logging: {
                        title: "Enable logging for Vtube Errors",
                        type: "boolean",
                        default: true,
                    }, 
                    token: {
                        title: "Token",
                        description:
                            "Token of the Vtube Websocket. Leave this blank if you cant find it.",
                        type: "string",
                        default: "",
                    },
                },
            },
        },
    },
    integration: new vTubeIntegration(eventManager),
});