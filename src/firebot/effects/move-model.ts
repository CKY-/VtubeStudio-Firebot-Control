"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { CurrentModelVariable } from "../types";
import { moveModel } from "../vtube-remote"
/**
* The Trigger Hotkey Effect
*/
export const moveModelEffect: Firebot.EffectType<{
  timeInSeconds: number;
  valuesAreRelativeToModel: boolean;
  positionX?: number;
  positionY?: number;
  rotation?: number;
  size?: number;
}> = {
  /**
  * The definition of the Effect
  */
  definition: {
    id: "vtube:move-model",
    name: "VTube Move Model",
    description: "Move the current model in any direction",
    icon: "fad fa-arrows-turn-to-dots",
    categories: ["common"],
  },
  /**
  * The HTML template for the Options view (ie options when effect is added to something such as a button.
  * You can alternatively supply a url to a html file via optionTemplateUrl
  */
  optionsTemplate: `
      <eos-container header="Model Position">
              <div class="input-group">
                    <span class="input-group-addon" id="delay-length-effect-type">timeInSeconds</span>
                    <input ng-model="effect.timeInSeconds" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Values Are Relative To Model
                    <input type="checkbox" ng-model="effect.valuesAreRelativeToModel">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div class="input-group">
                    <span class="input-group-addon" id="delay-length-effect-type">positionX</span>
                    <input ng-model="effect.positionX" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">positionY</span>
                    <input ng-model="effect.positionY" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">rotation</span>
                    <input ng-model="effect.rotation" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">size</span>
                    <input ng-model="effect.size" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
          <p>
            <button style="margin-top:3px" class="btn btn-link" ng-click="reloadCurrentModel()">Refresh Model Information</button>
            <span class="muted">(Make sure VTube Studio is running and Connected)</span>
          </p>
      </eos-container>
    `,
  /**
  * The controller for the front end Options
  * Port over from effectHelperService.js
  */
  optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
    $scope.modelCollections = [];

    $scope.getCurrentModel = () => {
      $q.when(backendCommunicator.fireEventAsync("vtube-get-current-model")).then(
        (modelCollections: CurrentModelVariable) => {
          $scope.modelCollections = modelCollections.modelPosition ?? [];
          $scope.effect.timeInSeconds = $scope.effect.timeInSeconds ?? $scope.modelCollections.timeInSeconds
          $scope.effect.valuesAreRelativeToModel = $scope.effect.valuesAreRelativeToModel ?? $scope.effect.valuesAreRelativeToModel
          $scope.effect.positionX = $scope.effect.positionX ?? $scope.modelCollections.positionX
          $scope.effect.positionY = $scope.effect.positionY ?? $scope.modelCollections.positionY
          $scope.effect.rotation = $scope.effect.rotation ?? $scope.modelCollections.rotation
          $scope.effect.size = $scope.effect.size ?? $scope.modelCollections.size 
        }); 
    };
    $scope.getCurrentModel();
    $scope.reloadCurrentModel = () => {
      $q.when(backendCommunicator.fireEventAsync("vtube-get-current-model")).then(
        (modelCollections: CurrentModelVariable) => {
          $scope.modelCollections = modelCollections.modelPosition ?? [];
          $scope.effect.positionX = $scope.modelCollections.positionX
          $scope.effect.positionY = $scope.modelCollections.positionY
          $scope.effect.rotation = $scope.modelCollections.rotation
          $scope.effect.size = $scope.modelCollections.size
        });
    };
  },
  /**
  * When the effect is triggered by something
  * Used to validate fields in the option template.
  */
  optionsValidator: effect => {
    const errors = [];
    if (effect.timeInSeconds == null) {
      errors.push("Please set a time.");
    }
    return errors;
  },
  /**
  * When the effect is triggered by something
  */
  onTriggerEvent: async event => {
      await moveModel(
        event.effect.timeInSeconds,
        event.effect.valuesAreRelativeToModel,
        event.effect.positionX,
        event.effect.positionY,
        event.effect.rotation,
        event.effect.size
      );
      return true;
  }
};
