"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { ItemListVariable } from "../types";
import {  loadItem } from "../vtube-remote"
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
    icon: "fad fa-keyboard",
    categories: ["common"],
  },
  /**
  * The HTML template for the Options view (ie options when effect is added to something such as a button.
  * You can alternatively supply a url to a html file via optionTemplateUrl
  */
  optionsTemplate: `
      <eos-container header="Item selection">
        <ui-select ng-model="selected" on-select="selectKey($select.selected.name)">
          <ui-select-match placeholder="Select an Item...">{{$select.selected.name}}</ui-select-match>
          <ui-select-choices repeat="item in itemCollections.availableItemFiles | filter: {name: $select.search}">
            <div ng-bind-html="item.name | highlight: $select.search"></div>
          </ui-select-choices>
        </ui-select>
          <p>
            <button class="btn btn-link" ng-click="reloadItemList()">Refresh Item Collections</button>
            <span class="muted">(Make sure VTube Studio is running and Connected)</span>
          </p>
      </eos-container>
      <eos-container header="Item Position">
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
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">order</span>
                    <input ng-model="effect.order" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Fail If Order Taken
                    <input type="checkbox" ng-model="effect.failIfOrderTaken">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">fade time</span>
                    <input ng-model="effect.fadeTime" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">Smothing</span>
                    <input ng-model="effect.smothing" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
          <p>
            <button style="margin-top:3px" class="btn btn-link" ng-click="reloadItemsList()">Refresh Model Information</button>
            <span class="muted">(Make sure VTube Studio is running and Connected)</span>
          </p>
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
                <label class="contro l-fb control--checkbox">Locked
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

    $scope.getItemList = () => {
      $q.when(backendCommunicator.fireEventAsync("vtube-get-item-list")).then(
        (itemCollections: ItemListVariable) => {
          $scope.itemCollections = itemCollections ?? [];
          $scope.effect.fileName = $scope.effect.fileName ?? $scope.itemCollections.fileName
          $scope.effect.fadeTime = $scope.effect.fadeTime ?? $scope.itemCollections.fadeTime
          $scope.effect.order = $scope.effect.order ?? $scope.itemCollections.order
          $scope.effect.failIfOrderTaken = $scope.effect.failIfOrderTaken ?? $scope.itemCollections.failIfOrderTaken
          $scope.effect.smoothing = $scope.effect.smoothing ?? $scope.itemCollections.smoothing
          $scope.effect.censored = $scope.effect.censored ?? $scope.itemCollections.censored
          $scope.effect.flipped = $scope.effect.flipped ?? $scope.itemCollections.flipped
          $scope.effect.locked = $scope.effect.locked ?? $scope.itemCollections.locked
          $scope.effect.unloadWhenPluginDisconnects = $scope.effect.unloadWhenPluginDisconnects ?? $scope.itemCollections.unloadWhenPluginDisconnects
          $scope.effect.positionX = $scope.effect.positionX ?? $scope.itemCollections.positionX
          $scope.effect.positionY = $scope.effect.positionY ?? $scope.itemCollections.positionY
          $scope.effect.rotation = $scope.effect.rotation ?? $scope.itemCollections.rotation
          $scope.effect.size = $scope.effect.size ?? $scope.itemCollections.size 
        }); 
    };
    $scope.getItemList();
    $scope.reloadItemList = () => {
      $q.when(backendCommunicator.fireEventAsync("vtube-get-item-list")).then(
        (itemCollections: ItemListVariable) => {
          $scope.itemCollections = itemCollections ?? [];
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
      await loadItem(
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
      return true;
  }
};