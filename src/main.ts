import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { initRemote } from "./firebot/vtube-remote";
import { initLogger, logger } from "./logger";
import { setupFrontendListeners } from "./firebot/communicator";
import { VTUBEEventSource } from "./firebot/events/vtube-event-source";
import { vTubeParams } from "./firebot/types";
import { getItemListVariable } from "./firebot/varables/get-item-list";
import { getAvailableModelsVariable } from "./firebot/varables/get-available-models";
import { getArtMeshListVariable } from "./firebot/varables/get-art-mesh-list";
import { getCurrentModelVarable } from "./firebot/varables/get-current-models";
import { getHotkeysInCurrentModelVaraible } from "./firebot/varables/get-hotkeys-in-current-model";
import { getLive2DParameterListVarable } from "./firebot/varables/get-live-2d-parameter-list";

const script: Firebot.CustomScript<vTubeParams> = {
  getScriptManifest: () => {
    return {
      name: "Vtube Studio Script",
      description: "Vtube Studio Script for controling vtube",
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
        default: 8001,
        description: "Port",
        secondaryDescription:
          "Port the Vtube Websocket is running on. Default is 8001.",
      },
      token: {
        type: "string",
        default: "",
        description: "Token file",
        secondaryDescription:
          "Token of the Vtube Websocket. Create a file and use it.",
      },
      logging: {
        type: "boolean",
        default: false,
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
      fs,
      frontendCommunicator,
      replaceVariableManager,
      eventFilterManager,
    } = modules;
// 
    initRemote(
      {
        ip: parameters.ipAddress,
        port: parameters.port, 
        token: parameters.token,
        logging: parameters.logging,
      },
      {
        eventManager,
        fs
      }
    );

    setupFrontendListeners(frontendCommunicator);
    //effectManager.registerEffect();
    eventManager.registerEventSource(VTUBEEventSource);
    replaceVariableManager.registerReplaceVariable(getArtMeshListVariable);
    replaceVariableManager.registerReplaceVariable(getAvailableModelsVariable);
    replaceVariableManager.registerReplaceVariable(getCurrentModelVarable);
    replaceVariableManager.registerReplaceVariable(getHotkeysInCurrentModelVaraible);
    replaceVariableManager.registerReplaceVariable(getItemListVariable);
    replaceVariableManager.registerReplaceVariable(getLive2DParameterListVarable);
  },
};
export default script;
