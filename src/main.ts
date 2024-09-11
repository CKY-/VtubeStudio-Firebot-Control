import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import {  initRemote } from "./firebot/vtube-remote";
import { initLogger, logger } from "./logger";
import { setupFrontendListeners } from "./firebot/communicator";
import { VTUBEEventSource } from "./firebot/events/vtube-event-source";
import { vTubeParams } from "./firebot/types";
import { getItemListVariable } from "./firebot/variables/get-item-list";
import { getAvailableModelsVariable } from "./firebot/variables/get-available-models";
import { getArtMeshListVariable } from "./firebot/variables/get-art-mesh-list";
import { getCurrentModelVariable } from "./firebot/variables/get-current-models";
import { getHotkeysInCurrentModelVariable } from "./firebot/variables/get-hotkeys-in-current-model";
import { getLiveParameterListVariable } from "./firebot/variables/get-live-parameter-list";
import { expressionStateEffect } from "./firebot/effects/expresion-state";
import { triggerHotkeyEffect } from "./firebot/effects/trigger-hotkey";
import { moveModelEffect } from "./firebot/effects/move-model";
import { expressionActivationEffect } from "./firebot/effects/expresion-activate";
import { moveItemEffect } from "./firebot/effects/move-item";
import { loadItemEffect } from "./firebot/effects/load-item";
import { unloadItemEffect } from "./firebot/effects/unload-item";
import { loadModelEffect } from "./firebot/effects/load-model";
import { ModelNameEventFilter } from "./firebot/filters/model-loaded-filter";
import { colorTintEffect } from "./firebot/effects/color-tint";
import { pinItemEffect } from "./firebot/effects/pin-item";
import { loadPinItemEffect } from "./firebot/effects/load-and-pin-item";

const script: Firebot.CustomScript<vTubeParams> = {
  getScriptManifest: () => {
    return {
      name: "Vtube Studio Script",
      description: "VTube Studio Script for controlling VTube Studio",
      author: "CKY",
      version: "1.0.9",
      firebotVersion: "5",
      startupOnly: true,
    };
  },

  getDefaultParameters: () => {
    return {

      ipAddress: {
        title: "Ip Address",
        type: "string",
        default: "localhost",
        description: "IP Address",
        secondaryDescription:
          "The ip address of the computer running Vtube. Use 'localhost' for the same computer.",
      },
      port: {
        title: "Port",
        type: "number",
        default: 8001,
        description: "Port",
        secondaryDescription:
          "Port the Vtube Websocket is running on. Default is 8001.",
      },
      tokenFile: {
        title: "Token File",
        type: "filepath",
        default: "",
        description: "Token file",
        secondaryDescription:
          "Specify a text file for the token to be stored.",
      },
      onlyClicksOnModel: {
        title: "onlyClicksOnModel",
        type: "boolean",
        default: false,
        description: "Enable clicking for Vtube model",
      },
      logging: {
        title: "Logging",
        type: "boolean",
        default: false,
        description: "Enable logging for Vtube",
      }, 

      loggingModelOutline: {
        title: "Logging Model Outline",
        type: "boolean",
        default: false,
        description: "Enable logging for Vtube Outline Info, Will flood the log file ",
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
      integrationManager
    } = modules;

    initRemote(
      {
        ip: parameters.ipAddress,
        port: parameters.port, 
        onlyClicksOnModel: parameters.onlyClicksOnModel,
        tokenFile: parameters.tokenFile,
        logging: parameters.logging,
        loggingModelOutline: parameters.loggingModelOutline,
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
    effectManager.registerEffect(loadModelEffect);
    effectManager.registerEffect(moveModelEffect);
    effectManager.registerEffect(moveItemEffect);
    effectManager.registerEffect(loadItemEffect);
    effectManager.registerEffect(unloadItemEffect);
    effectManager.registerEffect(colorTintEffect);
    effectManager.registerEffect(pinItemEffect);
    effectManager.registerEffect(loadPinItemEffect);

    eventManager.registerEventSource(VTUBEEventSource);

    eventFilterManager.registerFilter(ModelNameEventFilter);

    replaceVariableManager.registerReplaceVariable(getArtMeshListVariable);
    replaceVariableManager.registerReplaceVariable(getAvailableModelsVariable);
    replaceVariableManager.registerReplaceVariable(getCurrentModelVariable);
    replaceVariableManager.registerReplaceVariable(getHotkeysInCurrentModelVariable);
    replaceVariableManager.registerReplaceVariable(getLiveParameterListVariable);
    replaceVariableManager.registerReplaceVariable(getItemListVariable);
  },
};
export default script;
