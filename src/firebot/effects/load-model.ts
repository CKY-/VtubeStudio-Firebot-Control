"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { AvailableModelsVariable } from "../types";
import { loadModel, getCurrentModel, getAvailableModels } from "../vtube-remote"
/**
* The Trigger Hotkey Effect
*/
export const loadModelEffect: Firebot.EffectType<{
    modelID: string;
    modelName: string;
    loadMode: string;
}> = {
    /**
    * The definition of the Effect
    */
    definition: {
        id: "vtube:load-model",
        name: "VTube Load Model",
        description: "Load a model",
        icon: "fad fa-people-arrows",
        categories: ["common"],
    },
    /**
    * The HTML template for the Options view (ie options when effect is added to something such as a button.
    * You can alternatively supply a url to a html file via optionTemplateUrl
    */
    optionsTemplate: `
        <eos-container header="Model Mode" pad-top="true">
            <div class="controls-fb" style="padding-bottom: 5px;">
                <label class="control-fb control--radio">Load Model <tooltip text="'Allows selection of model to load'"></tooltip>
                    <input type="radio" ng-model="effect.loadMode" value="model"/>
                    <div class="control__indicator"></div>
                </label>
                <label class="control-fb control--radio">Load Random Model <tooltip text="'Loads a random model'"></tooltip>
                    <input type="radio" ng-model="effect.loadMode" value="random"/>
                    <div class="control__indicator"></div>
                </label>
            </div>
      </eos-container>
      <eos-container header="Model" ng-if="effect.loadMode === 'model'">
          <ui-select ng-model="selected" on-select="selectModel($select.selected.modelID, $select.selected.modelName)">
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
    `,
    /**
    * The controller for the front end Options
    * Port over from effectHelperService.js
    */
    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
        $scope.modelCollections = [];
        if ($scope.effect.loadMode == null) {
            $scope.effect.loadMode = "model";
        }

        $scope.selectModel = (modelID: string, modelName: string) => {
            $scope.effect.modelName = modelName;
            $scope.effect.modelID = modelID;

        };
        $scope.getAvailableModels = () => {
            $q.when(backendCommunicator.fireEventAsync("vtube-get-available-models")).then(
                (modelCollections: AvailableModelsVariable) => {
                    $scope.modelCollections = modelCollections.availableModels ?? [];
                    $scope.selected = $scope.modelCollections.find((model: { modelName: string; }) =>
                        model.modelName === $scope.effect.modelName
                    );
                });
        };
        $scope.getAvailableModels();

        $scope.reloadAvailableModels = () => {
            $q.when(backendCommunicator.fireEventAsync("vtube-get-available-models")).then(
                (modelCollections: AvailableModelsVariable) => {
                    $scope.modelCollections = modelCollections.availableModels ?? [];
                });
        };
    },
    /**
    * When the effect is triggered by something
    * Used to validate fields in the option template.
    */
    optionsValidator: effect => {
        const errors = [];
        if (effect.loadMode !== "random") {
            if (effect.modelID == null) {
                errors.push("Please select a model.");
            }
        }
        return errors;
    },
    /**
    * When the effect is triggered by something
    */
    onTriggerEvent: async event => {
        if (event.effect.loadMode === "random") {
            const currentModel = await getCurrentModel();
            const loadedModels = await getAvailableModels();
            const otherModels = loadedModels.availableModels.filter((m: { modelID: string; }) => m.modelID !== currentModel.modelID)
            const randomModel = otherModels[Math.floor(otherModels.length * Math.random())]
            event.effect.modelID = randomModel.modelID;
        }

        await loadModel(
            event.effect.modelID
        );
        return true;
    }
};