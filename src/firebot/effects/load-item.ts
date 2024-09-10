"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { ItemListVariable } from "../types";
import { loadItem } from "../vtube-remote";
import { Logger } from "@crowbartools/firebot-custom-scripts-types/types/modules/logger";
/**
* The Trigger Hotkey Effect
*/
export const loadItemEffect: Firebot.EffectType<{
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
}> = {
  /**
  * The definition of the Effect
  */
  definition: {
    id: "vtube:load-item",
    name: "VTube Load Item",
    description: "Load a new item to the scene",
    icon: "fad fa-box-full",
    categories: ["common"],
  },
  /**
  * The HTML template for the Options view (ie options when effect is added to something such as a button.
  * You can alternatively supply a url to a html file via optionTemplateUrl
  */
  optionsTemplate: `
      <eos-container header="Item selection">
        <ui-select ng-model="selected" on-select="selectItem($select.selected.fileName)">
          <ui-select-match placeholder="Select an Item...">{{$select.selected.fileName}}</ui-select-match>
          <ui-select-choices repeat="item in itemCollections | filter: {fileName: $select.search}">
            <div ng-bind-html="item.fileName | highlight: $select.search"></div>
            <small ng-bind-html="item.type | highlight: $select.search"></small>
          </ui-select-choices>
        </ui-select>
          <p>
            <button class="btn btn-link" ng-click="reloadItemList()">Refresh Item Collection</button>
            <span class="muted">(Make sure VTube Studio is running and Connected)</span>
          </p>
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
                <label class="control-fb control--checkbox">Fail If Order Taken
                    <input type="checkbox" ng-model="effect.failIfOrderTaken">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">Fade Time</span>
                    <input ng-model="effect.fadeTime" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">Smoothing</span>
                    <input ng-model="effect.smoothing" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
      </eos-container>
      <eos-container header="Item Information">
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Flipped
                    <input type="checkbox" ng-model="effect.flipped">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Censored
                    <input type="checkbox" ng-model="effect.censored">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Locked
                    <input type="checkbox" ng-model="effect.locked">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Unload When Plugin Disconnects
                    <input type="checkbox" ng-model="effect.unloadWhenPluginDisconnects">
                    <div class="control__indicator"></div>
                </label>
              </div>
      </eos-container>
      <eos-container pad-top="true" class="ng-isolate-scope">
            <div class="effect-info alert alert-warning ng-scope">
              Note: All items must be added in VTube Studio. 
            </div>
      </eos-container>
    `,
  /**
  * The controller for the front end Options
  * Port over from effectHelperService.js
  */
  optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
    $scope.itemCollections = [];

    $scope.selectItem = (fileName: string) => {
      $scope.effect.fileName = fileName;
    };

    $scope.getItemList = () => {
      $q.when(backendCommunicator.fireEventAsync("vtube-get-item-list")).then(
        (itemCollections: ItemListVariable) => {
          $scope.itemCollections = itemCollections.availableItemFiles ?? [];
          $scope.selected = $scope.itemCollections.find((item: { fileName: string; }) =>
            item.fileName === $scope.effect.fileName);
        });
    };
    
    $scope.getItemList();
    $scope.reloadItemList = () => {
      $q.when(backendCommunicator.fireEventAsync("vtube-get-item-list")).then(
        (itemCollections: ItemListVariable) => {
          $scope.itemCollections = itemCollections.availableItemFiles ?? [];
        });
    };
  },
  /**
  * When the effect is triggered by something
  * Used to validate fields in the option template.
  */
  optionsValidator: effect => {
    const errors = [];
    if (effect.fileName == null) {
      errors.push("Please set a file.");
    }
    return errors;
  },
  /**
  * When the effect is triggered by something
  */
  onTriggerEvent: async event => {
    let item = await loadItem(
      event.effect.fileName,
      event.effect.positionX,
      event.effect.positionY,
      event.effect.rotation,
      event.effect.size,
      event.effect.fadeTime,
      event.effect.order,
      event.effect.failIfOrderTaken,
      event.effect.smoothing,
      event.effect.censored,
      event.effect.flipped,
      event.effect.locked,
      event.effect.unloadWhenPluginDisconnects,
    );
    return {
      success: true,
      outputs: {
        itemInstanceID: item.instanceID,
        itemFileName: item.fileName
      }
    };
  }
};
