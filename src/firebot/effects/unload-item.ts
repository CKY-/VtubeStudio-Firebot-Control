"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { ItemListVariable, ItemUnloadEffect } from "../types";
import { unloadItem } from "../vtube-remote"
/**
* The Trigger Hotkey Effect
*/
export const unloadItemEffect: Firebot.EffectType<ItemUnloadEffect> = {
    /**
    * The definition of the Effect
    */
    definition: {
        id: "vtube:unload-item",
        name: "VTube Unload Item",
        description: "Unload all or selected items",
        icon: "fad fa-trash-can",
        categories: ["common"],
    },
    /**
    * The HTML template for the Options view (ie options when effect is added to something such as a button.
    * You can alternatively supply a url to a html file via optionTemplateUrl
    */
    optionsTemplate: `
        <eos-container header="Item selection">
          <ui-select ng-model="selected" on-select="selectItem($select.selected.instanceID, $select.selected.fileName)">
          <ui-select-match placeholder="Select an Item...">{{$select.selected.fileName}}</ui-select-match>
          <ui-select-choices repeat="item in itemCollections | filter: {fileName: $select.search}">
            <div ng-bind-html="item.fileName | highlight: $select.search"></div>
            </ui-select-choices>
          </ui-select>
          <p>
            <button class="btn btn-link" ng-click="reloadItemList()">Refresh Item Collections</button>
            <span class="muted">(Make sure VTube Studio is running and Connected)</span>
          </p>
        </eos-container>
        <eos-container header="Item Unloading">
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Unload All In Scene
                    <input type="checkbox" ng-model="effect.unloadAllInScene">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Unload All Loaded By This Plugin
                    <input type="checkbox" ng-model="effect.unloadAllLoadedByThisPlugin">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Allow Unloading Items Loaded By User Or Other Plugins
                    <input type="checkbox" ng-model="effect.allowUnloadingItemsLoadedByUserOrOtherPlugins">
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

        $scope.selectItem = (instanceID: string, fileName: string) => {
            $scope.effect.fileNames = [fileName];
            $scope.effect.instanceIDs = [instanceID];
        };

        $scope.getItemList = () => {
            $q.when(backendCommunicator.fireEventAsync("vtube-get-item-list")).then(
                (itemCollections: ItemListVariable) => {
                    $scope.itemCollections = itemCollections.itemInstancesInScene ?? [];
                    $scope.selected = $scope.itemCollections.find((item: { fileNames: string; }) =>
                        item.fileNames === $scope.effect.fileNames);
                });
        };
        $scope.getItemList();
        $scope.reloadItemList = () => {
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
        if (effect.fileNames == null) {
            errors.push("Please select a Item.");
        }
        return errors;
    },
    /**
    * When the effect is triggered by something
    */
    onTriggerEvent: async event => {
        await unloadItem(
            event.effect.unloadAllInScene,
            event.effect.unloadAllLoadedByThisPlugin,
            event.effect.allowUnloadingItemsLoadedByUserOrOtherPlugins,
            event.effect.instanceIDs,
            event.effect.fileNames
        );
        return true;
    }
};
