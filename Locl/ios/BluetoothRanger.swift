//
//  BluetoothRanger.swift
//  Locl
//

import Foundation
import CoreBluetooth
import CoreLocation
import UIKit

@objc (BluetoothRanger)
class BluetoothRanger: NSObject, CLLocationManagerDelegate {
  
  var locationManager: CLLocationManager!
  var loclTestRegion: CLBeaconRegion!
  var enteredRegion = false
  
  // initialize the bluetooth ranger
  @objc func initLocationManager() -> Void {
    let uuid: String = "5A4BCFCE-174E-4BAC-A814-092E77F6B7E5"
    let major: CLBeaconMajorValue = 123
    let minor: CLBeaconMinorValue = 456
    let id = "loclTest"
    self.locationManager = CLLocationManager()
    self.locationManager.delegate = self
    if (!CLLocationManager.locationServicesEnabled()) {
      println("Location services are not enabled");
    }
    self.locationManager.requestAlwaysAuthorization()
    self.loclTestRegion = CLBeaconRegion(proximityUUID: NSUUID(UUIDString: uuid), major: major, minor: minor, identifier: id)
    self.locationManager.startMonitoringForRegion(loclTestRegion)
    self.locationManager.startRangingBeaconsInRegion(loclTestRegion)
    self.locationManager.requestStateForRegion(loclTestRegion)
  }
  
  // authorize the bluetooth ranger
  @objc func locationManager(manager: CLLocationManager!, didChangeAuthorizationStatus status: CLAuthorizationStatus) {
    
    switch status{
      
    case .AuthorizedAlways:
      
      println("running")
      
    case .Denied:
      
      println("denied")
      
    default:
      println("default case")
      
    }
    
  }
  
  // get current location of beacon
  @objc func locationManager(manager: CLLocationManager!, didDetermineState state: CLRegionState, forRegion region: CLRegion!) {
  
    switch state {
  
    case .Unknown:
      println("unknown")
  
    case .Inside:
      println("inside")
  
    case .Outside:
      println("outside")
  
    }
  }
  
  @objc func stopLocationManager(){
    if (locationManager != nil){
      locationManager.stopMonitoringForRegion(loclTestRegion)
      locationManager.stopRangingBeaconsInRegion(loclTestRegion)
      locationManager = nil
    }
  }
  
  //
  @objc func enteredLocation(manager: CLLocationManager!, didEnterRegion region: CLRegion!) {
    enteredRegion = true
    println("entered region")
  }
  
  @objc func exitedLocation(manager: CLLocationManager!, didExitRegion region: CLRegion!) {
    enteredRegion = false
    println("exited region")
  }
  
  
}
