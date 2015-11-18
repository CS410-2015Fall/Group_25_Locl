//
//  BluetoothBeacon.m
//  Locl
//
//  Created by Corey Wilson on 2015-10-08.
//  Copyright © 2015 Facebook. All rights reserved.

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@interface

RCT_EXTERN_MODULE(BluetoothBeacon, NSObject)

RCT_EXTERN_METHOD(initLocalBeacon)

RCT_EXTERN_METHOD(stopLocalBeacon)

RCT_EXTERN_METHOD(setMinor: (int)minor callback:(RCTResponseSenderBlock *)successCallback)

@end
