import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { initRemote } from "./vtube-remote";
import { initLogger, logger } from "./logger";
import { setupFrontendListeners } from "./firebot/communicator";
import { VTUBEEventSource } from "./firebot/events/vtube-event-source";

interface Params {
  ipAddress: string;
  port: number;
  token: string;
  logging: boolean;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Vtube Studio Script",
      description: "Vtube Studio Script for contling vtube",
      author: "CKY",
      version: "1.0.1",
      firebotVersion: "5",
      startupOnly: true,
    };
  },

  getDefaultParameters: () => {
    return {
      ipAddress: {
        type: "string",
        default: "localhost",
        description: "IP Address",
        secondaryDescription:
          "The ip address of the computer running Vtube. Use 'localhost' for the same computer.",
      },
      port: {
        type: "number",
        default: 4444,
        description: "Port",
        secondaryDescription:
          "Port the Vtube Websocket is running on. Default is 4444.",
      },
      token: {
        type: "string",
        default: "",
        description: "Token",
        secondaryDescription:
          "Token of the Vtube Websocket. Leave this blank if you cant find it.",
      },
      logging: {
        type: "boolean",
        default: true,
        description: "Enable logging for Vtube Errors",
      },
    };
  },

  run: ({ parameters, modules }) => {
    initLogger(modules.logger);

    logger.info("Starting Vtube Control...");

    const {
      effectManager,
      eventManager,
      frontendCommunicator,
      replaceVariableManager,
      eventFilterManager,
    } = modules;

    initRemote(
      {
        ip: parameters.ipAddress,
        port: parameters.port,
        token: parameters.token,
        logging: parameters.logging,
        
      },
      {
        eventManager,
      }
    );
    
    setupFrontendListeners(frontendCommunicator);
    //effectManager.registerEffect();
    eventManager.registerEventSource(VTUBEEventSource);
    //replaceVariableManager.registerReplaceVariable();
  },
};
export default script;
