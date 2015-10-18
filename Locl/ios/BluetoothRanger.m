//
//  BluetoothRanger.m
//  Locl
//
//  Created by Kieran Collery on 2015-10-16.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(BluetoothRanger, NSObject)

RCT_EXTERN_METHOD(initLocationManager)

RCT_EXTERN_METHOD(updateAuthorizationStatus: (CLLocationManager *) manager didChangeAuthorizationStatus: (CLAuthorizationStatus *) status)
RCT_EXTERN_METHOD(findCurrentLocation: (CLLocationManager *) manager didDetermineState:(CLRegionState *) state forregion: (CLRegion *) region)
RCT_EXTERN_METHOD(enteredLocation: (CLLocationManager) manager didEnterRegion: (CLRegion *) region)
RCT_EXTERN_METHOD(exitedLocation: (CLLocationManager) manager didExitRegion: (CLRegion *) region)

@end

