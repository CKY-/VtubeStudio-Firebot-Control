import { HotkeyType, ILive2DParameter, ItemType, IVTSParameter, RestrictedRawKey } from "vtubestudio/lib/types";

export type vTubeSettings = {
    websocketSettings: {
        ipAddress: string;
        port: number;
        token: string;
    };
    misc: {
        logging: boolean;

    };
};

export type vTubeParams = {
    ipAddress: string;
    port: number;
    token: string;
    logging: boolean;
};

export type modeldata = {
    modelID: string,
    modelName: string,
    modelPosition: {
        positionX: number,
        positionY: number,
        rotation: number,
        size: number
    }
}

export type CurrentModelVariable =  {
    modelLoaded: boolean,
    modelName: string,
    modelID: string,
    vtsModelName: string,
    vtsModelIconName: string,
    live2DModelName: string,
    modelLoadTime: number,
    timeSinceModelLoaded: number,
    numberOfLive2DParameters: number,
    numberOfLive2DArtmeshes: number,
    hasPhysicsFile: boolean,
    numberOfTextures: number,
    textureResolution: number,
    modelPosition: {
        positionX: number,
        positionY: number,
        rotation: number,
        size: number,
    }
};

export type AvailableModelsVariable = {
    numberOfModels: number,
    availableModels: {
        modelLoaded: boolean,
        modelName: string,
        modelID: string,
        vtsModelName: string,
        vtsModelIconName: string,
    }[]
};

export type MoveModelEffect = {
    timeInSeconds: number,
    valuesAreRelativeToModel: boolean,
    positionX?: number,
    positionY?: number,
    rotation?: number,
    size?: number,
};

export type HotkeysInCurrentModelVariable = {
    modelLoaded: boolean,
    modelName: string,
    modelID: string,
    availableHotkeys: {
        name: string,
        type: keyof typeof HotkeyType,
        description: string,
        file: string,
        hotkeyID: string,
        keyCombination: RestrictedRawKey[],
        onScreenButtonID: number,
    }[]
}

export type HotkeyTriggerEffect = {
    hotkeyID: string
    itemInstanceID?: string
};

export type ExpressionStateEffect = {
    modelLoaded: boolean,
    modelName: string,
    modelID: string,
    expressions: {
        name: string,
        file: string,
        active: boolean,
        deactivateWhenKeyIsLetGo: boolean,
        autoDeactivateAfterSeconds: boolean,
        secondsRemaining: boolean,
        usedInHotkeys: {
            name: string,
            id: string,
        }[]
        parameters: {
            name: string,
            value: number,
        }[]
    }[]
}

export type ExpressionActivationEffect = {
    expressionFile: string,
    active: boolean,
};

export type ArtMeshListVariable = {
    modelLoaded: boolean,
    numberOfArtMeshNames: number,
    numberOfArtMeshTags: number,
    artMeshNames: string[],
    artMeshTags: string[],
}

export type ColorTint = {
    colorTint: {
        colorR: number
        colorG: number
        colorB: number
        colorA: number
        mixWithSceneLightingColor?: number
        jeb_?: true
    },
    artMeshMatcher: {
        tintAll: boolean
        artMeshNumber?: number[]
        nameExact?: string[]
        nameContains?: string[]
        tagExact?: string[]
        tagContains?: string[]
    }
};

export type SceneColorOverlayInfo = {
    active: boolean,
    itemsIncluded: boolean,
    isWindowCapture: boolean,
    baseBrightness: number,
    colorBoost: number,
    smoothing: number,
    colorOverlayR: number,
    colorOverlayG: number,
    colorOverlayB: number,
    colorAvgR: number,
    colorAvgG: number,
    colorAvgB: number,
    leftCapturePart: {
        active: boolean,
        colorR: number,
        colorG: number,
        colorB: number,
    },
    middleCapturePart: {
        active: boolean,
        colorR: number,
        colorG: number,
        colorB: number,
    },
    rightCapturePart: {
        active: boolean,
        colorR: number,
        colorG: number,
        colorB: number,
    },
};

export type FaceFound = {
    found: boolean
};

export type InputParameterList = {
    modelLoaded: boolean,
    modelName: string,
    modelID: string,
    customParameters: IVTSParameter[],
    defaultParameters: IVTSParameter[],
};

export type ParameterValue = {
    name: string
};

export type LiveParameterListVaraible = {
    modelLoaded: boolean,
    modelName: string,
    modelID: string,
    parameters: ILive2DParameter[],
};

export type ParameterCreation = {
    parameterName: string,
    explanation: string,
    min: number,
    max: number,
    defaultValue: number,
};

export type ParameterDeletion = {
    parameterName: string
};

export type InjectParameterData = {
    faceFound?: boolean,
    mode?: 'set' | 'add',
    parameterValues: {
        id: string,
        weight?: number,
        value: number,
    }[]
};

export type GetCurrentModelPhysicsVariable = {
    modelLoaded: boolean,
    modelName: string,
    modelID: string,
    modelHasPhysics: boolean,
    physicsSwitchedOn: boolean,
    usingLegacyPhysics: boolean,
    physicsFPSSetting: 30 | 60 | 120 | -1,
    baseStrength: number,
    baseWind: number,
    apiPhysicsOverrideActive: boolean,
    apiPhysicsOverridePluginName: string,
    physicsGroups: {
        groupID: string,
        groupName: string,
        strengthMultiplier: number,
        windMultiplier: number,
    }[]
};

export type SetCurrentModelPhysicsEffect = {
    strengthOverrides: {
        id: string,
        value: number,
        setBaseValue: boolean,
        overrideSeconds: number,
    }[]
    windOverrides: {
        id: string,
        value: number,
        setBaseValue: boolean,
        overrideSeconds: number,
    }[]
};

export type NDIConfig = {
    setNewConfig: boolean,
    ndiActive: boolean,
    useNDI5: boolean,
    useCustomResolution: boolean,
    customWidthNDI: number,
    customHeightNDI: number,
};

export type ItemListVariable = {
    itemsInSceneCount: number,
    totalItemsAllowedCount: number,
    canLoadItemsRightNow: boolean,
    availableSpots: number[],
    itemInstancesInScene: {
        fileName: string,
        instanceID: string,
        order: number,
        type: ItemType,
        censored: boolean,
        flipped: boolean,
        locked: boolean,
        smoothing: number,
        framerate: number,
        frameCount: number,
        currentFrame: number,
        pinnedToModel: boolean,
        pinnedModelID: string,
        pinnedArtMeshID: string,
        groupName: string,
        sceneName: string,
        fromWorkshop: boolean,
    }[],
    availableItemFiles: {
        fileName: string,
        type: ItemType,
        loadedCount: boolean,
    }[]
}

export type ItemLoadEffect = {
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
};

export type ItemUnloadEffect = {
    unloadAllInScene: boolean,
    unloadAllLoadedByThisPlugin: boolean,
    allowUnloadingItemsLoadedByUserOrOtherPlugins: boolean,
    instanceIDs: string[],
    fileNames: string[],
};

export type ItemAnimationControlEffect = {
    itemInstanceID: string
    framerate: number
    frame: number
    brightness: number
    opacity: number
    setAutoStopFrames: boolean
    autoStopFrames: number[]
    setAnimationPlayState: boolean
    animationPlayState: boolean
};

export type ItemMoveEffect = {
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
};

export type EventSubscription = {
    eventName: string
    subscribe: boolean
    config: object
};

export type ArtMeshSelection = {
    textOverride?: string | null
    helpOverride?: string | null
    requestedArtMeshCount: number
    activeArtMeshes?: string[]
};

export type TestEvent =  {
    testMessageForEvent?: string
};

export type ModelLoadedEvent =  {
    modelID?: string[]
};

export type TrackingStatusChangedEvent = {

};

export type BackgroundChangedEvent =  {

};

export type ModelConfigChangedEvent =  {

};

export type ModelMovedEvent =  {

};

export type ModelOutlineEvent =  {
    modelName: string,
    modelID: string,
    convexHull: { x: number, y: number }[],
    convexHullCenter: { x: number, y: number },
    windowSize: { x: number, y: number },
}