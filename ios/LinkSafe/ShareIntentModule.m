#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE (ShareIntentModule, NSObject)

RCT_EXTERN_METHOD(getSharedText : (RCTPromiseResolveBlock)
                      resolve rejecter : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getPendingLinks : (RCTPromiseResolveBlock)
                      resolve rejecter : (RCTPromiseRejectBlock)reject)

@end
