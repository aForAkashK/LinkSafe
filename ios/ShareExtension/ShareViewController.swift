//
//  ShareViewController.swift
//  ShareExtension
//
//  Created by Akash Kumar on 15/01/26.
//

import UIKit
import UniformTypeIdentifiers

class ShareViewController: UIViewController {
    
    // App Group identifier - must match the main app
    let appGroupIdentifier = "group.com.linksafe.shared"
    let pendingLinksKey = "PendingLinks"
    
    private var sharedURL: String = ""
    
    // UI Elements
    private let containerView = UIView()
    private let handleView = UIView()
    private let iconContainerView = UIView()
    private let appIconView = UIImageView()
    private let titleLabel = UILabel()
    private let urlContainerView = UIView()
    private let urlIconView = UIImageView()
    private let urlLabel = UILabel()
    private let infoLabel = UILabel()
    private let warningContainerView = UIView()
    private let warningIconView = UIImageView()
    private let warningLabel = UILabel()
    private let doneButton = UIButton(type: .system)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        handleSharedContent()
    }
    
    private func setupUI() {
        view.backgroundColor = UIColor.black.withAlphaComponent(0.4)
        
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(doneTapped))
        tapGesture.delegate = self
        view.addGestureRecognizer(tapGesture)
        
        // Container
        containerView.backgroundColor = .systemBackground
        containerView.layer.cornerRadius = 20
        containerView.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
        containerView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(containerView)
        
        // Handle
        handleView.backgroundColor = .systemGray4
        handleView.layer.cornerRadius = 2.5
        handleView.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(handleView)
        
        // Icon Container
        iconContainerView.backgroundColor = UIColor.systemBlue.withAlphaComponent(0.1)
        iconContainerView.layer.cornerRadius = 16
        iconContainerView.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(iconContainerView)
        
        // App Icon
        let iconConfig = UIImage.SymbolConfiguration(pointSize: 28, weight: .medium)
        appIconView.image = UIImage(systemName: "link.badge.plus", withConfiguration: iconConfig)
        appIconView.tintColor = .systemBlue
        appIconView.translatesAutoresizingMaskIntoConstraints = false
        iconContainerView.addSubview(appIconView)
        
        // Title
        titleLabel.text = "Add to LinkSafe"
        titleLabel.font = .systemFont(ofSize: 20, weight: .bold)
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(titleLabel)
        
        // URL Container
        urlContainerView.backgroundColor = .secondarySystemBackground
        urlContainerView.layer.cornerRadius = 12
        urlContainerView.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(urlContainerView)
        
        // URL Icon
        let config = UIImage.SymbolConfiguration(pointSize: 20, weight: .medium)
        urlIconView.image = UIImage(systemName: "globe", withConfiguration: config)
        urlIconView.tintColor = .systemGray
        urlIconView.translatesAutoresizingMaskIntoConstraints = false
        urlContainerView.addSubview(urlIconView)
        
        // URL Label
        urlLabel.text = "Loading..."
        urlLabel.font = .systemFont(ofSize: 14)
        urlLabel.textColor = .secondaryLabel
        urlLabel.numberOfLines = 2
        urlLabel.lineBreakMode = .byTruncatingMiddle
        urlLabel.translatesAutoresizingMaskIntoConstraints = false
        urlContainerView.addSubview(urlLabel)
        
        // Info Label
        infoLabel.text = "This link will be saved to your LinkSafe collection"
        infoLabel.font = .systemFont(ofSize: 14)
        infoLabel.textColor = .label
        infoLabel.textAlignment = .center
        infoLabel.numberOfLines = 0
        infoLabel.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(infoLabel)
        
        // Warning Container
        warningContainerView.backgroundColor = UIColor.systemOrange.withAlphaComponent(0.1)
        warningContainerView.layer.cornerRadius = 10
        warningContainerView.layer.borderWidth = 1
        warningContainerView.layer.borderColor = UIColor.systemOrange.withAlphaComponent(0.3).cgColor
        warningContainerView.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(warningContainerView)
        
        // Warning Icon
        let warningConfig = UIImage.SymbolConfiguration(pointSize: 16, weight: .semibold)
        warningIconView.image = UIImage(systemName: "exclamationmark.triangle.fill", withConfiguration: warningConfig)
        warningIconView.tintColor = .systemOrange
        warningIconView.translatesAutoresizingMaskIntoConstraints = false
        warningContainerView.addSubview(warningIconView)
        
        // Warning Label
        warningLabel.text = "Open LinkSafe app to complete saving"
        warningLabel.font = .systemFont(ofSize: 13, weight: .medium)
        warningLabel.textColor = .systemOrange
        warningLabel.numberOfLines = 0
        warningLabel.translatesAutoresizingMaskIntoConstraints = false
        warningContainerView.addSubview(warningLabel)
        
        // Done Button
        doneButton.setTitle("Done", for: .normal)
        doneButton.titleLabel?.font = .systemFont(ofSize: 16, weight: .semibold)
        doneButton.backgroundColor = .systemBlue
        doneButton.setTitleColor(.white, for: .normal)
        doneButton.layer.cornerRadius = 12
        doneButton.translatesAutoresizingMaskIntoConstraints = false
        doneButton.addTarget(self, action: #selector(doneTapped), for: .touchUpInside)
        containerView.addSubview(doneButton)
        
        NSLayoutConstraint.activate([
            containerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            containerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            containerView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            handleView.topAnchor.constraint(equalTo: containerView.topAnchor, constant: 8),
            handleView.centerXAnchor.constraint(equalTo: containerView.centerXAnchor),
            handleView.widthAnchor.constraint(equalToConstant: 36),
            handleView.heightAnchor.constraint(equalToConstant: 5),
            
            iconContainerView.topAnchor.constraint(equalTo: handleView.bottomAnchor, constant: 20),
            iconContainerView.centerXAnchor.constraint(equalTo: containerView.centerXAnchor),
            iconContainerView.widthAnchor.constraint(equalToConstant: 64),
            iconContainerView.heightAnchor.constraint(equalToConstant: 64),
            
            appIconView.centerXAnchor.constraint(equalTo: iconContainerView.centerXAnchor),
            appIconView.centerYAnchor.constraint(equalTo: iconContainerView.centerYAnchor),
            
            titleLabel.topAnchor.constraint(equalTo: iconContainerView.bottomAnchor, constant: 12),
            titleLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 20),
            titleLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -20),
            
            urlContainerView.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 20),
            urlContainerView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            urlContainerView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            
            urlIconView.leadingAnchor.constraint(equalTo: urlContainerView.leadingAnchor, constant: 14),
            urlIconView.centerYAnchor.constraint(equalTo: urlContainerView.centerYAnchor),
            urlIconView.widthAnchor.constraint(equalToConstant: 24),
            urlIconView.heightAnchor.constraint(equalToConstant: 24),
            
            urlLabel.leadingAnchor.constraint(equalTo: urlIconView.trailingAnchor, constant: 10),
            urlLabel.trailingAnchor.constraint(equalTo: urlContainerView.trailingAnchor, constant: -14),
            urlLabel.topAnchor.constraint(equalTo: urlContainerView.topAnchor, constant: 14),
            urlLabel.bottomAnchor.constraint(equalTo: urlContainerView.bottomAnchor, constant: -14),
            
            infoLabel.topAnchor.constraint(equalTo: urlContainerView.bottomAnchor, constant: 16),
            infoLabel.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 20),
            infoLabel.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -20),
            
            warningContainerView.topAnchor.constraint(equalTo: infoLabel.bottomAnchor, constant: 16),
            warningContainerView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            warningContainerView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            
            warningIconView.leadingAnchor.constraint(equalTo: warningContainerView.leadingAnchor, constant: 14),
            warningIconView.centerYAnchor.constraint(equalTo: warningContainerView.centerYAnchor),
            warningIconView.widthAnchor.constraint(equalToConstant: 20),
            warningIconView.heightAnchor.constraint(equalToConstant: 20),
            
            warningLabel.leadingAnchor.constraint(equalTo: warningIconView.trailingAnchor, constant: 10),
            warningLabel.trailingAnchor.constraint(equalTo: warningContainerView.trailingAnchor, constant: -14),
            warningLabel.topAnchor.constraint(equalTo: warningContainerView.topAnchor, constant: 12),
            warningLabel.bottomAnchor.constraint(equalTo: warningContainerView.bottomAnchor, constant: -12),
            
            doneButton.topAnchor.constraint(equalTo: warningContainerView.bottomAnchor, constant: 20),
            doneButton.leadingAnchor.constraint(equalTo: containerView.leadingAnchor, constant: 16),
            doneButton.trailingAnchor.constraint(equalTo: containerView.trailingAnchor, constant: -16),
            doneButton.heightAnchor.constraint(equalToConstant: 50),
            doneButton.bottomAnchor.constraint(equalTo: containerView.safeAreaLayoutGuide.bottomAnchor, constant: -16),
        ])
        
        containerView.transform = CGAffineTransform(translationX: 0, y: 400)
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        UIView.animate(withDuration: 0.35, delay: 0, usingSpringWithDamping: 0.85, initialSpringVelocity: 0.5) {
            self.containerView.transform = .identity
        }
    }
    
    private func handleSharedContent() {
        guard let extensionItem = extensionContext?.inputItems.first as? NSExtensionItem,
              let itemProvider = extensionItem.attachments?.first else {
            showError("No content to share")
            return
        }
        
        if itemProvider.hasItemConformingToTypeIdentifier(UTType.url.identifier) {
            itemProvider.loadItem(forTypeIdentifier: UTType.url.identifier, options: nil) { [weak self] (item, error) in
                DispatchQueue.main.async {
                    if let url = item as? URL {
                        self?.processURL(url.absoluteString)
                    } else {
                        self?.showError("Could not load URL")
                    }
                }
            }
        } else if itemProvider.hasItemConformingToTypeIdentifier(UTType.plainText.identifier) {
            itemProvider.loadItem(forTypeIdentifier: UTType.plainText.identifier, options: nil) { [weak self] (item, error) in
                DispatchQueue.main.async {
                    if let text = item as? String {
                        self?.processURL(text)
                    } else {
                        self?.showError("Could not load text")
                    }
                }
            }
        } else {
            showError("Unsupported content type")
        }
    }
    
    private func processURL(_ urlString: String) {
        sharedURL = urlString
        
        // Display URL
        if let url = URL(string: urlString), let host = url.host {
            urlLabel.text = host + (url.path.count > 1 ? url.path : "")
        } else {
            urlLabel.text = urlString
        }
        
        // Immediately add to pending links queue (no button press needed)
        addToPendingLinks()
    }
    
    private func addToPendingLinks() {
        guard !sharedURL.isEmpty else { return }
        
        if let userDefaults = UserDefaults(suiteName: appGroupIdentifier) {
            var pendingLinks = userDefaults.stringArray(forKey: pendingLinksKey) ?? []
            
            // Avoid duplicates
            if !pendingLinks.contains(sharedURL) {
                pendingLinks.append(sharedURL)
                userDefaults.set(pendingLinks, forKey: pendingLinksKey)
                userDefaults.synchronize()
            }
        }
    }
    
    private func showError(_ message: String) {
        urlLabel.text = message
        urlIconView.image = UIImage(systemName: "xmark.circle.fill")
        urlIconView.tintColor = .systemRed
        infoLabel.text = "Unable to process this content"
        warningContainerView.isHidden = true
    }
    
    @objc private func doneTapped() {
        closeExtension()
    }
    
    private func closeExtension() {
        UIView.animate(withDuration: 0.25) {
            self.containerView.transform = CGAffineTransform(translationX: 0, y: 400)
            self.view.backgroundColor = .clear
        } completion: { _ in
            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
        }
    }
}

extension ShareViewController: UIGestureRecognizerDelegate {
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
        let location = touch.location(in: view)
        return !containerView.frame.contains(location)
    }
}
