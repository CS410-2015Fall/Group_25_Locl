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
  
  let localBeaconUUID = "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0"
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
  @objc func setMinor(minor: Int, callback successCallback: RCTResponseSenderBlock) {
    setMinor = minor
    
    let resultsDict = [
      "success" : true,
      "successMsg" : "Minor set to \(setMinor)"
    ];
    
    successCallback([resultsDict]);
  }
  
  //Acts as an intermediary between your app and the iOS Bluetooth stack
  @objc func peripheralManagerDidUpdateState(peripheral: CBPeripheralManager) {
    switch peripheral.state {
    case CBPeripheralManagerState.PoweredOn:
      peripheralManager.startAdvertising(beaconPeripheralData as! [String: AnyObject]!)
    case CBPeripheralManagerState.PoweredOff:
      peripheralManager.stopAdvertising()
    case CBPeripheralManagerState.Resetting:
      peripheralManager.stopAdvertising()
    case CBPeripheralManagerState.Unsupported:
      peripheralManager.stopAdvertising()
    case CBPeripheralManagerState.Unauthorized:
      peripheralManager.stopAdvertising()
    case CBPeripheralManagerState.Unknown:
      peripheralManager.stopAdvertising()
    default:
      peripheralManager.stopAdvertising()
    }
    
  }
}

