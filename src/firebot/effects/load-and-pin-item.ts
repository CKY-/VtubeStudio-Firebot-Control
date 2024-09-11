"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { AvailableModelsVariable, ItemListVariable, ItemPin } from "../types";
import { loadItem, pinItem } from "../vtube-remote"

/**
* The Trigger Hotkey Effect
*/
type EffectType = {
    itemSelected: string;
    modelSelected: string;
    data: ItemPin;
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
}
export const loadPinItemEffect: Firebot.EffectType<EffectType> = {
    /**
    * The definition of the Effect
    */
    definition: {
        id: "vtube:load-and-pin-item",
        name: "VTube load and pin Item",
        description: "Pin item to selected model",
        icon: "fad fa-trash-alt",
        categories: ["common"],
    },
    /**
    * The HTML template for the Options view (ie options when effect is added to something such as a button.
    * You can alternatively supply a url to a html file via optionTemplateUrl
    */
    optionsTemplate: `
       <eos-container header="Item selection">
          <ui-select ng-model="itemSelected" on-select="selectItem($select.selected.instanceID, $select.selected.fileName)">
          <ui-select-match placeholder="Select an Item...">{{$select.selected.fileName}}</ui-select-match>
          <ui-select-choices repeat="item in itemCollections | filter: {fileName: $select.search}">
            <div ng-bind-html="item.fileName | highlight: $select.search"></div>
            </ui-select-choices>
          </ui-select>
          <p>
            <button class="btn btn-link" ng-click="reloadItemList()">Refresh Item Collections</button>
            <span class="muted">(Make sure VTube Studio is running and Connected)</span>
          </p>
          <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Pin
                    <input type="checkbox" ng-model="effect.data.pin">
                    <div class="control__indicator"></div>
                </label>
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

      <eos-container header="Model">
          <ui-select ng-model="modelSelected" on-select="selectModel($select.selected.modelID, $select.selected.modelName)">
            <ui-select-match placeholder="Select a Model...">{{$select.selected.modelName}}</ui-select-match>
            <ui-select-choices repeat="model in modelCollections | filter: {modelName: $select.search}">
                <div ng-bind-html="model.modelName | highlight: $select.search"></div>
            </ui-select-choices>
          </ui-select>
          <p>
            <button style="margin-top:3px" class="btn btn-link" ng-click="reloadAvailableModels()">Refresh Model Collection</button>
            <span class="muted">(Make sure VTube Studio is running and Connected)</span>
          </p>
      </eos-container>
      <eos-container header="Position">
             <div style="padding-top:10px; padding-bottom:10px; display: inline-flex; width: 100%;">
                    <span style=" width: 25%;" class="input-group-addon" id="delay-length-effect-type">angleRelativeTo</span>
                    <dropdown-select options="angleRelativeTo" selected="effect.data.angleRelativeTo"></dropdown-select>
             </div>

             <div style="padding-top:10px; padding-bottom:10px; display: inline-flex; width: 100%;">
                    <span style=" width: 25%;" class="input-group-addon" id="delay-length-effect-type">sizeRelativeTo</span>
                    <dropdown-select options="sizeRelativeTo" selected="effect.data.sizeRelativeTo"></dropdown-select>
             </div>

             <div style="padding-top:10px; padding-bottom:10px; display: inline-flex; width: 100%;">
                    <span style=" width: 25%;" class="input-group-addon" id="delay-length-effect-type">vertexPinType</span>
                    <dropdown-select options="vertexPinType" selected="effect.data.vertexPinType"></dropdown-select>
             </div>

             <div class="input-group">
                    <span class="input-group-addon" id="delay-length-effect-type">Angle</span>
                    <input ng-model="effect.data.pinInfo.angle" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
             </div>

             <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">Size</span>
                    <input ng-model="effect.data.pinInfo.size" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
             </div>

             <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">vertexID1</span>
                    <input ng-model="effect.data.pinInfo.vertexID1" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
             </div>

             <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">vertexID2</span>
                    <input ng-model="effect.data.pinInfo.vertexID2" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
             </div>

             <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">vertexID3</span>
                    <input ng-model="effect.data.pinInfo.vertexID3" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
             </div>
              
             <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">vertexWeight1</span>
                    <input ng-model="effect.data.pinInfo.vertexWeight1" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
             </div>

             <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">vertexWeight2</span>
                    <input ng-model="effect.data.pinInfo.vertexWeight2" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
             </div>

             <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">vertexWeight3</span>
                    <input ng-model="effect.data.pinInfo.vertexWeight3" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
             </div>
      </eos-container>
      <eos-container pad-top="true" class="ng-isolate-scope">
            <div class="effect-info alert alert-warning ng-scope">
               Note: All items must be loaded in VTube Studio. 
            </div>
      </eos-container>
    `,
    /**
    * The controller for the front end Options
    * Port over from effectHelperService.js
    */
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.angleRelativeTo = ['RelativeToWorld' , 'RelativeToCurrentItemRotation' , 'RelativeToModel' , 'RelativeToPinPosition']
        $scope.sizeRelativeTo = ['RelativeToWorld' , 'RelativeToCurrentItemSize']
        $scope.vertexPinType = ['Provided', 'Center', 'Random']
        if ($scope.effect.data == null) {
            $scope.effect.data = {};
            $scope.effect.data.pinInfo = {};
            $scope.effect.data.itemInstanceID="";
        }
      
        $scope.modelCollections = [];
        $scope.selectModel = (modelID: string, modelName: string) => {
            $scope.effect.data.pinInfo.modelID = modelID;
            console.log($scope.effect.data.pinInfo)
        };
        
        $scope.getAvailableModels = () => {
            $q.when(backendCommunicator.fireEventAsync("vtube-get-available-models")).then(
                (modelCollections: AvailableModelsVariable) => {
                    $scope.modelCollections = modelCollections.availableModels ?? [];
                    $scope.modelSelected = $scope.modelCollections.find((model: { modelName: string; }) => {
                        model.modelName === $scope.effect.modelName
                    });
                });
        };

        $scope.getAvailableModels();

        $scope.reloadAvailableModels = () => {
            $q.when(backendCommunicator.fireEventAsync("vtube-get-available-models")).then(
                (modelCollections: AvailableModelsVariable) => {
                    $scope.modelCollections = modelCollections.availableModels ?? [];
                });
        };

        $scope.itemCollections = [];

        $scope.selectItem = (instanceID: string, fileName: string) => {
            console.log(instanceID)
            $scope.effect.data.itemInstanceID = instanceID;
            console.log($scope.effect.data.itemInstanceID)
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
        if (effect.data.itemInstanceID == null) {
            errors.push("Please select a Item.");
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
        event.effect.data.itemInstanceID = item.instanceID;
        console.log(event.effect.data)
        await pinItem(
            event.effect.data
        );
        return true;
    }
};