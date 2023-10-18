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
import { getLiveParameterListVarable } from "./firebot/varables/get-live-parameter-list";
import { expressionStateEffect } from "./firebot/effects/expresion-state";
import { triggerHotkeyEffect } from "./firebot/effects/trigger-hotkey";
import { moveModelEffect } from "./firebot/effects/move-model";
import { expressionActivationEffect } from "./firebot/effects/expresion-activate";
import { moveItemEffect } from "./firebot/effects/move-item";
import { loadItemEffect } from "./firebot/effects/load-item";
import { unloadItemEffect } from "./firebot/effects/unload-item";

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
     // eventFilterManager,
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
        fs
      }
    );

    setupFrontendListeners(frontendCommunicator);
    effectManager.registerEffect(expressionStateEffect);
    effectManager.registerEffect(expressionActivationEffect);
    effectManager.registerEffect(triggerHotkeyEffect);
    effectManager.registerEffect(moveModelEffect);
    effectManager.registerEffect(moveItemEffect);
    effectManager.registerEffect(loadItemEffect);
    effectManager.registerEffect(unloadItemEffect);
    eventManager.registerEventSource(VTUBEEventSource);
    replaceVariableManager.registerReplaceVariable(getArtMeshListVariable);
    replaceVariableManager.registerReplaceVariable(getAvailableModelsVariable);
    replaceVariableManager.registerReplaceVariable(getCurrentModelVarable);
    replaceVariableManager.registerReplaceVariable(getHotkeysInCurrentModelVaraible);
    replaceVariableManager.registerReplaceVariable(getLiveParameterListVarable);
    replaceVariableManager.registerReplaceVariable(getItemListVariable);
  },
};
export default script;