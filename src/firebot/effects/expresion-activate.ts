"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { triggerExpressionActivation } from "../vtube-remote"
/**
 * The Expression State Effect
 */
export const expressionActivationEffect: Firebot.EffectType<{
    activate: boolean,
    filepath: string
}> = {
    /**
    * The definition of the Effect
    */
    definition: {
        id: "vtube:expression-activate",
        name: "VTube Expression Activation",
        description: "Activate an Expression State File",
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
                <label class="control-fb control--checkbox"> Activate 
                    <input type="checkbox" ng-model="effect.activate">
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
        if ($scope.effect.activate == null) {
            $scope.effect.activate = false;
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
        await triggerExpressionActivation(event.effect.filepath, event.effect.activate);
        return true;
    }
};