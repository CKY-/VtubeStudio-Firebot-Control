"use strict";
import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { ItemListVariable, ItemMoveEffect } from "../types";
import { moveItem } from "../vtube-remote"
/**
* The Trigger Hotkey Effect
*/
export const moveItemEffect: Firebot.EffectType<{
  itemsToMove: {
    itemInstanceID: string
    timeInSeconds?: number
    fadeMode?: 'linear' | 'easeIn' | 'easeOut' | 'easeBoth' | 'overshoot' | 'zip'
    positionX?: number
    positionY?: number
    size?: number
    rotation?: number
    order?: number
    setFlip?: boolean
    flip?: boolean
    userCanStop?: boolean
  }[]
}> = {
  /**
  * The definition of the Effect
  */
  definition: {
    id: "vtube:move-item",
    name: "VTube Move Item",
    description: "Move the current items in any direction",
    icon: "fad fa-keyboard",
    categories: ["common"],
  },
  /**
  * The HTML template for the Options view (ie options when effect is added to something such as a button.
  * You can alternatively supply a url to a html file via optionTemplateUrl
  */
  optionsTemplate: `
      <eos-container header="Item">
              <ui-select ng-model="selected" on-select="selectKey($select.selected.instanceID, $select.selected.fileName)">
               <ui-select-match placeholder="Select a Item...">{{$select.selected.fileName}}</ui-select-match>
                <ui-select-choices repeat="item in itemCollections | filter: {fileName: $select.search}">
                  <div ng-bind-html="item.fileName | highlight: $select.search"></div>
               </ui-select-choices>
              </ui-select>
      </eos-container>
      <eos-container header="Time to Position">       
              <div class="input-group">
                    <span class="input-group-addon" id="delay-length-effect-type">timeInSeconds</span>
                    <input ng-model="effect.itemsToMove.timeInSeconds" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
      </eos-container>
      <eos-container header="Fade Mode"> 
              <div style="padding-top:10px">
               <dropdown-select options="fadeMode" selected="effect.itemsToMove.fadeMode"></dropdown-select>
              </div>
      </eos-container>
      <eos-container header="Item Position">
              <div class="input-group">
                    <span class="input-group-addon" id="delay-length-effect-type">positionX</span>
                    <input ng-model="effect.itemsToMove.positionX" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">positionY</span>
                    <input ng-model="effect.itemsToMove.positionY" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">rotation</span>
                    <input ng-model="effect.itemsToMove.rotation" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div>
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">size</span>
                    <input ng-model="effect.itemsToMove.size" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
              <div class="input-group" style="margin-top:10px" >
                    <span class="input-group-addon" id="delay-length-effect-type">order</span>
                    <input ng-model="effect.itemsToMove.order" type="text" class="form-control" aria-describedby="delay-length-effect-type" type="text" replace-variables="number">
              </div> 
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Set Flip
                    <input type="checkbox" ng-model="effect.itemsToMove.setFlip">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Flip
                    <input type="checkbox" ng-model="effect.itemsToMove.flip">
                    <div class="control__indicator"></div>
                </label>
              </div>
              <div style="padding-top:20px">
                <label class="control-fb control--checkbox">Can Stop
                    <input type="checkbox" ng-model="effect.itemsToMove.userCanStop">
                    <div class="control__indicator"></div>
                </label>
              </div>
          <p>
            <button style="margin-top:3px" class="btn btn-link" ng-click="reloadItemsList()">Refresh Model Information</button>
            <span class="muted">(Make sure VTube Studio is running and Connected)</span>
          </p>
      </eos-container>
    `,
  /**
  * The controller for the front end Options
  * Port over from effectHelperService.js
  */
  optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
    $scope.fadeMode =[
      'linear',
      'easeIn',
      'easeOut',
      'easeBoth',
      'overshoot',
      'zip'
    ];
    $scope.itemCollections = [];

    $scope.getItemList = () => {
      $q.when(backendCommunicator.fireEventAsync("vtube-get-item-list")).then(
        (itemCollections: ItemListVariable) => {
          $scope.itemCollections = itemCollections.itemInstancesInScene ?? [];
          $scope.effect.itemsToMove.order = $scope.effect.itemsToMove.order
          $scope.effect.itemsToMove.setFlip = $scope.effect.itemsToMove.setFlip ?? false;
          $scope.effect.itemsToMove.flip = $scope.effect.itemsToMove.flip ?? false
          $scope.effect.itemsToMove.userCanStop = $scope.effect.itemsToMove.userCanStop ?? false;
          $scope.effect.itemsToMove.fadeMode = $scope.effect.itemsToMove.fadeMode ?? "liner";
          $scope.effect.itemsToMove.timeInSeconds = $scope.effect.itemsToMove.timeInSeconds ?? 0;
          $scope.effect.itemsToMove.positionX = $scope.effect.itemsToMove.positionX ?? 0;
          $scope.effect.itemsToMove.positionY = $scope.effect.itemsToMove.positionY ?? 0;
          $scope.effect.itemsToMove.rotation = $scope.effect.itemsToMove.rotation ?? 360;
          $scope.effect.itemsToMove.size = $scope.effect.itemsToMove.size ?? 0;
        }); 
    };
    $scope.getItemList();
    $scope.reloadItemsList = () => {
      $q.when(backendCommunicator.fireEventAsync("vtube-get-item-list")).then(
        (itemCollections: ItemListVariable) => {
          $scope.itemCollections = itemCollections.itemInstancesInScene ?? [];
          $scope.effect.itemsToMove.order = $scope.effect.itemsToMove.order ?? 0;
          $scope.effect.itemsToMove.flip = $scope.effect.itemsToMove.flip ?? false;
        });
    };
  },
  /**
  * When the effect is triggered by something
  * Used to validate fields in the option template.
  */
  optionsValidator: effect => {
    const errors = [];
    if (effect.itemsToMove == null) {
      errors.push("Please set a time.");
    }
    return errors;
  },
  /**
  * When the effect is triggered by something
  */
  onTriggerEvent: async event => {
    
    await moveItem(event.effect.itemsToMove);
      return true;
  }
};

// error: Items
// {
//   itemsInSceneCount: 2,
//     totalItemsAllowedCount: 60,
//       canLoadItemsRightNow: true,
//         availableSpots: [
//           -30, -29, -28, -27, -26, -25, -24, -23, -22, -21, -20,
//           -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9,
//           -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3,
//           4, 5, 7, 8, 10, 11, 12, 13, 14, 15, 16,
//           17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
//           28, 29, 30
//         ],
//           itemInstancesInScene: [
//             {
//               fileName: 'beverage_Bepis (@7MDigital).png',
//               instanceID: '0546257d85c5452586b5f8f5973688c3',
//               order: 6,
//               type: 'PNG',
//               censored: false,
//               flipped: false,
//               locked: false,
//               smoothing: 0,
//               framerate: 0,
//               frameCount: -1,
//               currentFrame: -1,
//               pinnedToModel: false,
//               pinnedModelID: '',
//               pinnedArtMeshID: '',
//               groupName: '',
//               sceneName: '',
//               fromWorkshop: false
//             },
//             {
//               fileName: 'beverage_Boba (@7MDigital).png',
//               instanceID: 'e336b294b048494d9c791cb86dcca34f',
//               order: 9,
//               type: 'PNG',
//               censored: false,
//               flipped: false,
//               locked: false,
//               smoothing: 0,
//               framerate: 0,
//               frameCount: -1,
//               currentFrame: -1,
//               pinnedToModel: true,
//               pinnedModelID: '57ac6bef91f146029aae3a2ee6d03f51',
//               pinnedArtMeshID: 'D_CHEST_00',
//               groupName: '',
//               sceneName: 'cup',
//               fromWorkshop: false
//             }
//           ],
//             availableItemFiles: [
//               {
//                 fileName: 'akari_fly (@walfieee)',
//                 type: 'AnimationFolder',
//                 loadedCount: 0
//               },
//               {
//                 fileName: 'b_woozy (@denchisoft).png',
//                 type: 'PNG',
//                 loadedCount: 0
//               },
          
//               {
//                 fileName: 'live2d_pudding (@denchisoft)',
//                 type: 'Live2D',
//                 loadedCount: 0
//               },
//             ]
// }