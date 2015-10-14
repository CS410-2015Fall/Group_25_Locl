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
  @objc func initLocalBeacon() -> Void {
  if localBeacon != nil {
		stopLocalBeacon()
  }
  
  let localBeaconUUID = "5A4BCFCE-174E-4BAC-A814-092E77F6B7E5"
  let localBeaconMajor: CLBeaconMajorValue = 123
  let localBeaconMinor: CLBeaconMinorValue = 456
  
  let uuid = NSUUID(UUIDString: localBeaconUUID)!
  localBeacon = CLBeaconRegion(proximityUUID: uuid, major: localBeaconMajor, minor: localBeaconMinor, identifier: "Your private identifer here")
  
  beaconPeripheralData = localBeacon.peripheralDataWithMeasuredPower(nil)
  peripheralManager = CBPeripheralManager(delegate: self, queue: nil, options: nil)
  }
  
  
  //Stop broadcasting the current beacon
  @objc func stopLocalBeacon() {
    peripheralManager.stopAdvertising()
    peripheralManager = nil
    beaconPeripheralData = nil
    localBeacon = nil
  }
  
  //Acts as an intermediary between your app and the iOS Bluetooth stack
  @objc func peripheralManagerDidUpdateState(peripheral: CBPeripheralManager) {
    if peripheral.state == .PoweredOn {
      peripheralManager.startAdvertising(beaconPeripheralData as! [String: AnyObject]!)
    } else if peripheral.state == .PoweredOff {
      peripheralManager.stopAdvertising()
    }
  }
  
  //Set a new minor for the Beacon
  @objc func setNewMinor(minor: Int, errorCallback failureCallback: RCTResponseSenderBlock, callback successCallback: RCTResponseSenderBlock) -> Void {
    setMinor = minor;
    
    //TODO: Setup failure
    
    let resultsDict = [
      "success" : true,
      "message" : "Minor set to \(setMinor)"
    ];
    // Call the JavaScript sucess handler
    successCallback([resultsDict]);
  }
  
  //Get current minor for the Beacon
  @objc func getMinor(errorCallback failureCallback: RCTResponseSenderBlock, callback successCallback: RCTResponseSenderBlock) -> Int {
    //TODO: setup success/failure
    return setMinor;
  }
}

