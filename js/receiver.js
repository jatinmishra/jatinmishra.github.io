const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();
const LOG_RECEIVER_TAG = 'Receiver';
const castDebugLogger = cast.debug.CastDebugLogger.getInstance();
const playbackConfig = new cast.framework.PlaybackConfig();




/* context.addEventListener(cast.framework.system.EventType.READY, () => {
if (!castDebugLogger.debugOverlayElement_) {
castDebugLogger.setEnabled(false);
// castDebugLogger.showDebugLogs(true);
}
});



castDebugLogger.loggerLevelByEvents = {
'cast.framework.events.category.CORE':
cast.framework.LoggerLevel.INFO,
'cast.framework.events.EventType.MEDIA_STATUS':
cast.framework.LoggerLevel.DEBUG
};



if (!castDebugLogger.loggerLevelByTags) {
castDebugLogger.loggerLevelByTags = {};
}



castDebugLogger.loggerLevelByTags[LOG_RECEIVER_TAG] = cast.framework.LoggerLevel.DEBUG;



castDebugLogger.info(LOG_RECEIVER_TAG,
`autoResumeDuration set to: ${playbackConfig.autoResumeDuration}`);*/





/**
* Example of how to listen for events on playerManager.
*/
playerManager.addEventListener(
    cast.framework.events.EventType.ERROR, (event) => {
        castDebugLogger.error(LOG_RECEIVER_TAG,
            'Detailed Error Code - ' + event.detailedErrorCode);
        if (event && event.detailedErrorCode == 905) {
            castDebugLogger.error(LOG_RECEIVER_TAG,
                'LOAD_FAILED: Verify the load request is set up ' +
                'properly and the media is able to play.');
        }
    });



try {
    playbackConfig.protectionSystem = cast.framework.ContentProtection.WIDEVINE;
    context.start({ playbackConfig: playbackConfig });
    // Update playback config licenseUrl according to provided value in load request.
    context.getPlayerManager().setMediaPlaybackInfoHandler((loadRequest, playbackConfig) => {
        console.log(JSON.stringify(loadRequest.media.customData))
        playbackConfig.licenseRequestHandler = requestInfo => {
            requestInfo.withCredentials = false;
            // this is bearer auth token get in the app sent it to here
            console.log(JSON.stringify(requestInfo))
            // requestInfo.url = "https://dbm.keydelivery.northeurope.media.azure.net/Widevine/?kid=22cd2a7d-413b-438b-a06a-a03192c2d485";
            requestInfo.headers['Authorization'] = loadRequest.media.customData.Authorization;
            //requestInfo.headers['Content-Type'] = "text/xml; charset=utf-8";
            console.log(JSON.stringify(requestInfo))
        };
        // if (loadRequest.media.customData && loadRequest.media.customData.licenseUrl) {
        // // playbackConfig.licenseCustomData = loadRequest.media.customData;
        // // playbackConfig.licenseUrl = loadRequest.media.customData.licenseUrl;
        // // A function to customize request to get a license.
        // playbackConfig.licenseRequestHandler = requestInfo => {
        // requestInfo.withCredentials = false;
        // // this is bearer auth token get in the app sent it to here
        // console.log(JSON.stringify(requestInfo))
        // // requestInfo.url = "https://dbm.keydelivery.northeurope.media.azure.net/Widevine/?kid=22cd2a7d-413b-438b-a06a-a03192c2d485";
        // requestInfo.headers['Authorization'] = loadRequest.media.customData.Authorization;
        // //requestInfo.headers['Content-Type'] = "text/xml; charset=utf-8";
        // console.log(JSON.stringify(requestInfo))
        // };
        // }
        return playbackConfig;
    });
} catch (e) {
    console.log("error in playing: " + JSON.stringify(e));
}