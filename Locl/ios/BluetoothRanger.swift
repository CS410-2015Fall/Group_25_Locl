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
    self.loclTestRegion = CLBeaconRegion(proximityUUID: NSUUID(UUIDString: uuid), major: major, minor: minor, identifier: id)
    locationManager.requestAlwaysAuthorization()
    locationManager.delegate = self
  }
  
  // authorizae the bluetooth ranger
  @objc func updateAuthorizationStatus(manager: CLLocationManager!, didChangeAuthorizationStatus status: CLAuthorizationStatus) {
    
    switch status{
      
    case .AuthorizedAlways:
      
      locationManager.startMonitoringForRegion(loclTestRegion)
      locationManager.startRangingBeaconsInRegion(loclTestRegion)
      locationManager.requestStateForRegion(loclTestRegion)
      
    case .Denied:
      
      let alert = UIAlertController(title: "Warning", message: "You've disabled location update which is required for this app to work. Go to your phone settings and change the permissions.", preferredStyle: UIAlertControllerStyle.Alert)
      let alertAction = UIAlertAction(title: "OK!", style: UIAlertActionStyle.Default) { (UIAlertAction) -> Void in }
      alert.addAction(alertAction)
      
    default:
      println("default case")
      
    }
    
  }
  
  // get current location of beacone
  @objc func findCurrentLocation(manager: CLLocationManager!, didDetermineState state: CLRegionState, forRegion region: CLRegion!) {
  
    switch state {
  
    case .Unknown:
      println("unknown")
  
    case .Inside:
      println("inside")
  
    case .Outside:
      println("outside")
  
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
