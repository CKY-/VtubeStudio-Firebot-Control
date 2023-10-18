"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { HotkeysInCurrentModelVariable, AvailableHotkeys} from "../types";
import { triggerHotkey } from "../vtube-remote"
/**
* The Trigger Hotkey Effect
*/
export const triggerHotkeyEffect: Firebot.EffectType<{
    keyName: string
    keyID: string
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
        <ui-select ng-model="selected" on-select="selectKey($select.selected.hotkeyID, $select.selected.name)">
          <ui-select-match placeholder="Select a HotKey...">{{$select.selected.name}}</ui-select-match>
          <ui-select-choices repeat="key in keyCollections.availableHotkeys | filter: {name: $select.search}">
            <div ng-bind-html="key.name | highlight: $select.search"></div>
          </ui-select-choices>
        </ui-select>
          <p>
            <button class="btn btn-link" ng-click="getHotkeysInCurrentModel()">Refresh Hotkey Collections</button>
            <span class="muted">(Make sure VTube Studio is running and Connected)</span>
          </p>
      </eos-container>
      <eos-container pad-top="true" class="ng-isolate-scope">
            <div class="effect-info alert alert-warning ng-scope">
              Note: All hotkeys must be named in VTube Studio. 
            </div>
      </eos-container>
    `,
    /**
    * The controller for the front end Options
    * Port over from effectHelperService.js
    */
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.keyCollections = [];

        $scope.selectKey = (keyID: string, keyName:string) => {
            $scope.effect.keyID = keyID;
            $scope.effect.keyName = keyName;
        };
        $scope.getHotkeysInCurrentModel = () => {
            $q.when(backendCommunicator.fireEventAsync("vtube-get-hotkeys-in-current-model")).then(
                (keyCollections: HotkeysInCurrentModelVariable) => {
                    $scope.keyCollections = keyCollections ?? [];
                    $scope.selected = $scope.keyCollections.availableHotkeys.find((key: { name: AvailableHotkeys[]; }) =>
                        key.name === $scope.effect.keyName
                    );
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
        return errors;
    },
    /**
    * When the effect is triggered by something
    */
    onTriggerEvent: async event => {
        await triggerHotkey(event.effect.keyID);
        return true;
    }
};
