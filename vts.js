const vts = require('vtubestudio')
const fs = require('fs')
const WebSocket = require('ws')
console.log('loaded:')
const apiClient = new vts.ApiClient({
    authTokenGetter: () => fs.readFileSync('./auth-token.txt', 'utf-8'),
    authTokenSetter: (authenticationToken) => fs.writeFileSync('./auth-token.txt', authenticationToken, { encoding: 'utf-8' }),
    pluginName: 'VTS.JS Test',
    pluginDeveloper: 'Hawkbar',
    webSocketFactory: url => new WebSocket(url),
    url: "ws://localhost:8010",
    port: 8010
})
console.log(apiClient)
console.log('Running')
apiClient.on('connect', async () => {

    const stats = await apiClient.statistics()

    console.log(`Connected to VTube Studio v${stats.vTubeStudioVersion}`)

    let itemMove = await apiClient.itemMove({
                itemInstanceID: '14b5349296f940ee83c58c8319dcdb67',
                timeInSeconds: 0,
                fadeMode: 'linear',
                positionX: 0.1,
                positionY: 0.1,
                rotation: 0,
                size: 10,
                order: 8,
                setFlip: true,
                flip: true,
                userCanStop: true
    }) 
    console.log("item move recived", itemMove)

    console.log('Getting list of available models')
    const { availableModels } = await apiClient.availableModels()

    console.log('Adding event callback whenever a model is loaded')
    
    await apiClient.events.modelLoaded.subscribe((data) => {
        if (data.modelLoaded) {
            console.log('Model loaded, queuing up a random model switch')
            setTimeout(async () => {
                console.log('Switching to random model')
                const otherModels = availableModels.filter(m => m.modelID !== data.modelID)
                const randomModel = otherModels[Math.floor(otherModels.length * Math.random())]
                console.log('Switching to ' + randomModel.modelName)
                // await apiClient.modelLoad({ modelID: randomModel.modelID })
            }, 3000)
        }
    })
})