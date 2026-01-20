import Foundation
import React

@objc(ShareIntentModule)
class ShareIntentModule: NSObject {
  
  // App Group identifier - must match the one configured in both targets
  static let appGroupIdentifier = "group.com.akashkumar.linksafe.shared"
  static let pendingLinksKey = "PendingLinks"
  
  /// Returns all pending links as a JSON array string, then clears them
  @objc
  func getPendingLinks(_ resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      if let userDefaults = UserDefaults(suiteName: ShareIntentModule.appGroupIdentifier) {
        let pendingLinks = userDefaults.stringArray(forKey: ShareIntentModule.pendingLinksKey) ?? []
        
        // Clear after reading
        userDefaults.removeObject(forKey: ShareIntentModule.pendingLinksKey)
        userDefaults.synchronize()
        
        // Return the array
        resolve(pendingLinks)
      } else {
        resolve([])
      }
    }
  }
  
  /// Legacy method for backwards compatibility - returns first pending link
  @objc
  func getSharedText(_ resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      if let userDefaults = UserDefaults(suiteName: ShareIntentModule.appGroupIdentifier) {
        let pendingLinks = userDefaults.stringArray(forKey: ShareIntentModule.pendingLinksKey) ?? []
        
        if let firstLink = pendingLinks.first {
          // Clear after reading
          userDefaults.removeObject(forKey: ShareIntentModule.pendingLinksKey)
          userDefaults.synchronize()
          resolve(firstLink)
        } else {
          resolve(nil)
        }
      } else {
        resolve(nil)
      }
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
