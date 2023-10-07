"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { HotkeysInCurrentModelVariable } from "../types";
import { triggerHotkey } from "../vtube-remote"


/**
 * The File Writer effect
 */
export const triggerHotkeyEffect: Firebot.EffectType<{
    keyName: string
}> = {
    /**
   * The definition of the Effect
   */
    definition: {
        id: "vtube:trigger-hotkey",
        name: "VTube Trigger Hotkey",
        description: "Trigger a Preset Hotkey",
        icon: "fad fa-keyboard",
        categories: ["common"],
    },
    /**
    * The HTML template for the Options view (ie options when effect is added to something such as a button.
    * You can alternatively supply a url to a html file via optionTemplateUrl
    */
    optionsTemplate: `
      <eos-container header="Hotkey selection">
          <div class="btn-group" uib-dropdown>
             <button type="button" class="btn btn-default" uib-dropdown-toggle>
             {{effect.keyName}} <span class="caret"></span>
             </button>
             <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-button">
                <li role="menuitem" ng-repeat="key in keyCollections.availableHotkeys" ng-click="selectKey(key.hotkeyID)">
                    <a href>{{key.name}}</a>
                </li>
             </ul>
          </div>
      </eos-container>
    `,
    /**
   * The controller for the front end Options
   * Port over from effectHelperService.js
   */
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.keyCollections = [];

        $scope.selectKey = (key: string) => {
            $scope.effect.keyName = key;
        };
//{"modelLoaded":true,"modelName":"hijiki","modelID":"57ac6bef91f146029aae3a2ee6d03f51","availableHotkeys":[{"name":"BottomRight","type":"MoveModel","description":"Moves the Live2D model","file":"","hotkeyID":"6827ade81329413d80076dbf5984f6a1","keyCombination":[],"onScreenButtonID":1}]}
        $scope.getHotkeysInCurrentModel = () => {
            $q.when(backendCommunicator.fireEventAsync("vtube-get-hotkeys-in-current-model")).then(
                (keyCollections: HotkeysInCurrentModelVariable) => {
                    $scope.keyCollections = keyCollections ?? [];
                }
            );
        };
        $scope.getHotkeysInCurrentModel();
    },
    /**
   * When the effect is triggered by something
   * Used to validate fields in the option template.
   */
    optionsValidator: effect => {
        const errors = [];
        if (effect.keyName == null || effect.keyName === "") {
            errors.push("Please select a key.");
        }
        // const keyValueArray = [];
        // if (!keyValueArray.includes(effect.keyName)) {
        //     errors.push("Please select a key that is not Restricted.");
        // }
        return errors;
    },
    /**
   * When the effect is triggered by something
   */
    onTriggerEvent: async event => {
        await triggerHotkey(event.effect.keyName);
        return true;
    }
};
