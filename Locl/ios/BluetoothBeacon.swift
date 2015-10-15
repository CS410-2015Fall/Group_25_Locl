//
//  BluetoothBeacon.swift
//  CustomSwiftComponent
//

import Foundation
import CoreBluetooth
import CoreLocation

@objc (BluetoothBeacon)
class BluetoothBeacon: NSObject, CBPeripheralManagerDelegate {
  
  var localBeacon: CLBeaconRegion!
  var beaconPeripheralData: NSDictionary!
  var peripheralManager: CBPeripheralManager!
  var setMinor = 0
  
  //Creates the Beacon and starts broadcasting
  @objc func initLocalBeacon() {
  if localBeacon != nil {
		stopLocalBeacon()
  }
  
  let localBeaconUUID = "EF8C2C6F-6B73-4467-BCE2-32DFDDCCD5B9"
  let localBeaconMajor: CLBeaconMajorValue = 0
  let localBeaconMinor: CLBeaconMinorValue = CLBeaconMinorValue(setMinor)
  
  let uuid = NSUUID(UUIDString: localBeaconUUID)!
  localBeacon = CLBeaconRegion(proximityUUID: uuid, major: localBeaconMajor, minor: localBeaconMinor, identifier: "Locl")
  
  beaconPeripheralData = localBeacon.peripheralDataWithMeasuredPower(nil)
  peripheralManager = CBPeripheralManager(delegate: self, queue: nil, options: nil)
  }
  
  
  //Stop broadcasting the current beacon
  @objc func stopLocalBeacon() {
    if (peripheralManager == nil) {
      return
    }
    peripheralManager.stopAdvertising()
    peripheralManager = nil
    beaconPeripheralData = nil
    localBeacon = nil
  }
  
  //Set a new minor for the Beacon
  @objc func setNewMinor(minor: Int) {
    setMinor = minor;
  }
  
  @objc func setNewMinor(minor: Int, errorCallback failureCallback: RCTResponseSenderBlock, callback successCallback: RCTResponseSenderBlock) {
    // Check if fileName is nil or empty
    if (minor == 0) {
      let resultsDict = [
        "success": false,
        "errMsg": "Not an Int"
      ]
      // Execute the JavaScript failure callback handler
      failureCallback([resultsDict])
      return; // Halt execution of this function
    }
    
      // Success handling
    else {
      setMinor = minor
      // Craft a success return message
      let resultsDict = [
        "success" : true,
        "successMsg": "Minor set to \(setMinor)"
      ];
      // Call the JavaScript sucess handler
      successCallback([resultsDict]);
    }
  }
      
  
  
  
  //Get current minor for the Beacon
  @objc func getMinor(errorCallback failureCallback: RCTResponseSenderBlock, callback successCallback: RCTResponseSenderBlock) -> Int {
    return setMinor;
  }
  
  //Acts as an intermediary between your app and the iOS Bluetooth stack
  @objc func peripheralManagerDidUpdateState(peripheral: CBPeripheralManager) {
    if peripheral.state == .PoweredOn {
      peripheralManager.startAdvertising(beaconPeripheralData as! [String: AnyObject]!)
    } else if peripheral.state == .PoweredOff {
      peripheralManager.stopAdvertising()
    }
  }
}

