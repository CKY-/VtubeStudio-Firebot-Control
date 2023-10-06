"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { expressionState } from "../vtube-remote"

/**
 * The File Writer effect
 */
export const expressionStateEffect: Firebot.EffectType<{
    details: boolean,
    filepath: string
}> = {
    /**
   * The definition of the Effect
   */
    definition: {
        id: "vtube:expression-state",
        name: "vtube Expression State",
        description: "Load an Expression State File",
        icon: "fad fa-file-edit",
        categories: ["common"],
    },
    /**
    * The HTML template for the Options view (ie options when effect is added to something such as a button.
    * You can alternatively supply a url to a html file via optionTemplateUrl
    */
    optionsTemplate: `
        <eos-container header="File">
            <file-chooser model="effect.filepath" options="{ filters: [ {name:'All',extensions:['*']} ]}"></file-chooser>
        </eos-container>

        <eos-container header="Options" pad-top="true">
            <div style="padding-top:15px">
                <label class="control-fb control--checkbox"> Details 
                    <input type="checkbox" ng-model="effect.details">
                    <div class="control__indicator"></div>
                </label>
            </div>
        </eos-container>
    `,
    /**
   * The controller for the front end Options
   * Port over from effectHelperService.js
   */
    optionsController: ($scope) => {
        if ($scope.effect.details == null) {
            $scope.effect.details = false;
        }
    },
    /**
   * When the effect is triggered by something
   * Used to validate fields in the option template.
   */
    optionsValidator: effect => {
        const errors = [];
        if (effect.filepath == null || effect.filepath === "") {
            errors.push("Please select an Expression State File.");
        }
        return errors;
    },
    /**
   * When the effect is triggered by something
   */
    onTriggerEvent: async event => {
        await expressionState(event.effect.details, event.effect.filepath);
        return true;
    }
};

//module.exports = expressionStateEffect;