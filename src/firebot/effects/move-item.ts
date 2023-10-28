"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { ItemListVariable } from "../types";
import { moveItem } from "../vtube-remote"
/**
* The Trigger Hotkey Effect
*/
export const moveItemEffect: Firebot.EffectType<{

    itemInstanceID: string
    timeInSeconds?: number
    fadeMode?: 'linear' | 'easeIn' | 'easeOut' | 'easeBoth' | 'overshoot' | 'zip'
    positionX?: number
    positionY?: number
    size?: number
    rotation?: number
    order?: number
    setFlip?: boolean
    flip?: boolean
    userCanStop?: boolean

}> = {
 /**
  * The definition of the Effect
  */
  definition: {
    id: "vtube:move-item",
    name: "VTube Move Item",
    description: "Move the current items in any direction",
    icon: "fad fa-person-dolly-empty",
    categories: ["common"],
  },
  /**
  * The HTML template for the Options view (ie options when effect is added to something such as a button.
  * You can alternatively supply a url to a html file via optionTemplateUrl
  */
  optionsTemplate: `
      <eos-container header="Item">
          <ui-select ng-model="selected" on-select="selectItem($select.selected.instanceID, $select.selected.fileName)">
             <ui-select-match placeholder="Select a Item...">{{$select.selected.fileName}}</ui-select-match>
                <ui-select-choices repeat="item in itemCollections | filter: {fileName: $select.search}">
                <div ng-bind-html="item.fileName | highlight: $select.search"></div>
             </ui-select-choices>
          </ui-select>
          <p>
            <button style="margin-top:3px" class="btn btn-link" ng-click="reloadItemsList()">Refresh Loaded Item Collection</button>
            <span class="muted">(Make sure VTube Studio is running and Connected)</span>
          </p>
      </eos-container>
      <eos-container header="Time to Position">       
           <div class="input-group" style="padding-bottom:10px">
                <span class="input-group-addon" id="delay-length-effect-type">Time In Seconds</span>
                <input ng-model="effect.timeInSeconds" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
            </div> 
      </eos-container>
      <eos-container header="Fade Mode"> 
            <div style="padding-top:10px; padding-bottom:10px;">
               <dropdown-select options="Fade Mode" selected="effect.fadeMode"></dropdown-select>
            </div>
      </eos-container>
      <eos-container header="Item Position">
              <div class="input-group">
                    <span class="input-group-addon" id="delay-length-effect-type">Position X</span>
                    <input ng-model="effect.positionX" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">Position Y</span>
                    <input ng-model="effect.positionY" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">Rotation</span>
                    <input ng-model="effect.rotation" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">Size</span>
                    <input ng-model="effect.size" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">Order</span>
                    <input ng-model="effect.order" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Set Flip
                    <input type="checkbox" ng-model="effect.setFlip">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Flip
                    <input type="checkbox" ng-model="effect.flip">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Can Stop
                    <input type="checkbox" ng-model="effect.userCanStop">
                    <div class="control__indicator"></div>
                </label>
              </div>
      </eos-container>
    `,
  /**
  * The controller for the front end Options
  * Port over from effectHelperService.js
  */
  optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
    $scope.fadeMode = [
      'linear',
      'easeIn',
      'easeOut',
      'easeBoth',
      'overshoot',
      'zip'
    ];
    $scope.itemCollections = [];
    $scope.selectItem = (instanceID: string, fileName: string) => {
      $scope.effect.fileName = fileName;
      $scope.effect.itemInstanceID = instanceID;
    };

    $scope.getItemList = () => {
      $q.when(backendCommunicator.fireEventAsync("vtube-get-item-list")).then(
        (itemCollections: ItemListVariable) => {
          $scope.itemCollections = itemCollections.itemInstancesInScene ?? [];
          $scope.selected = $scope.itemCollections.find((item: { fileName: string; }) =>
            item.fileName === $scope.effect.fileName
          );
        });
    };
    $scope.getItemList();
    $scope.reloadItemsList = () => {
      $q.when(backendCommunicator.fireEventAsync("vtube-get-item-list")).then(
        (itemCollections: ItemListVariable) => {
          $scope.itemCollections = itemCollections.itemInstancesInScene ?? [];
        });
    };
  },
  /**
  * When the effect is triggered by something
  * Used to validate fields in the option template.
  */
  optionsValidator: effect => {
    const errors = [];
    if (effect.itemInstanceID == null) {
      errors.push("Please select an item.");
    }
    return errors;
  },
  /**
  * When the effect is triggered by something
  */
  onTriggerEvent: async event => {
    await moveItem(
      event.effect.itemInstanceID,
      event.effect.timeInSeconds,
      event.effect.fadeMode,
      event.effect.positionX ,
      event.effect.positionY,
      event.effect.size,
      event.effect.rotation,
      event.effect.order,
      event.effect.setFlip,
      event.effect.flip,
      event.effect.userCanStop
      );
    return true;
  }
};