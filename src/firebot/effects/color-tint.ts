"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { colorTint } from "../vtube-remote"
import { ColorTint } from "../types";

export const colorTintEffect: Firebot.EffectType<ColorTint> = {

    /**
    * The definition of the Effect
    */

    definition: {
        id: "vtube:color-tint",
        name: "VTube Color Tint",
        description: "color tint",
        icon: "fad fa-palette",
        categories: ["common"],
    },

    /**
    * The HTML template for the Options view (ie options when effect is added to something such as a button.
    * You can alternatively supply a url to a html file via optionTemplateUrl
    */

    optionsTemplate: `
      <eos-container header="Model Mode" pad-top="true">
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Jeb (optional)
                    <input type="checkbox" ng-model="effect.colorTint.jeb">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div class="input-group">
                    <span class="input-group-addon" id="delay-length-effect-type">Mix With Scene Lighting Color (optional)</span>
                    <input ng-model="effect.colorTint.mixWithSceneLightingColor" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div class="input-group">
                    <span class="input-group-addon" id="delay-length-effect-type">R</span>
                    <input ng-model="effect.colorTint.colorR" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
                    </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">G</span>
                    <input ng-model="effect.colorTint.colorG" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">B</span>
                    <input ng-model="effect.colorTint.colorB" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">A</span>
                    <input ng-model="effect.colorTint.colorA" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Tint All
                    <input type="checkbox" ng-model="effect.artMeshMatcher.tintAll">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div class="input-group">
                    <span class="input-group-addon" id="delay-length-effect-type">Art Mesh Number (optional)</span>
                    <input ng-model="effect.artMeshMatcher.artMeshNumber[0]" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div class="input-group">
                    <span class="input-group-addon" id="delay-length-effect-type">Name Exact (optional)</span>
                    <input ng-model="effect.artMeshMatcher.nameExact[0]" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">Name Contains (optional)</span>
                    <input ng-model="effect.artMeshMatcher.nameContains[0]" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">Tag Exact (optional)</span>
                    <input ng-model="effect.artMeshMatcher.tagExact[0]" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">Tag Contains (optional)</span>
                    <input ng-model="effect.artMeshMatcher.tagContains[0]" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
      </eos-container>
    `,

    /**
    * The controller for the front end Options
    * Port over from effectHelperService.js
    */

    optionsController: ($scope: any, backendCommunicator: any, $q: any) => {

    },

    /**
    * When the effect is triggered by something
    * Used to validate fields in the option template.
    */

    optionsValidator: effect => {
        const errors = [];
        if (effect !== null) {
            errors.push("Please Set A Color.");
        }
        if (isNaN(effect.colorTint.mixWithSceneLightingColor)){
            errors.push("mix with scene lighting must be a number");
        }
        if (isNaN(effect.colorTint.colorA)) {
            errors.push("color A must be a number 0-255");
        }
        if (isNaN(effect.colorTint.colorB)) {
            errors.push("color A must be a number 0-255");
        }
        if (isNaN(effect.colorTint.colorG)) {
            errors.push("color A must be a number 0-255");
        }
        if (isNaN(effect.colorTint.colorR)) {
            errors.push("color A must be a number 0-255");
        }
        if (isNaN(effect.artMeshMatcher.artMeshNumber[0])) {
            errors.push("Art Mesh Number must be a number");
        }
        return errors;
    },

    /**
    * When the effect is triggered by something
    */

    onTriggerEvent: async event => {
        await colorTint(
            event.effect
        )

        return true;
    }
};