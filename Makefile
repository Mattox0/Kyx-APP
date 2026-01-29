.DEFAULT_GOAL := help

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


.PHONY: install
install: ## Installer les dépendances
	@echo "Installing"
	@yarn install

.PHONY: start
start: ## Démarrer l'application
	@yarn start

.PHONY: clear
clear: ## Nettoyer le projet
	@yarn prebuild

.PHONY: install-ios
install-ios: ## Installer l'application de développement sous IOS
	@echo "Exécuter 'yarn prebuild' ? (y/n)"
	@./.dev/read-prebuild.sh ios
	yarn install
	yarn install:ios

.PHONY: install-emulator
install-emulator: ## Installer l'application de développement sous un émulateur (IOS)
	@echo "Exécuter 'yarn prebuild' ? (y/n)"
	@./.dev/read-prebuild.sh ios
	yarn install
	yarn ios

.PHONY: install-android
install-android: ## Installer l'application de développement sous Android
	@echo "Exécuter 'yarn prebuild' ? (y/n)"
	@./.dev/read-prebuild.sh android
	yarn install
	yarn install:android

.PHONY: build-local-ios
build-local-ios: ## Lancer un build de l'application pour IOS
	@yarn build:local:ios

.PHONY: build-local-ios-test
build-local-ios-test: ## Lancer un build de test de l'application pour IOS
	@yarn build:local:ios:test

.PHONY: build-local-android
build-local-android: ## Lancer un build de l'application pour Android
	@yarn build:local:android

.PHONY: build-local-android-test
build-local-android-test: ## Lancer un build de l'application pour Android
	@yarn build:local:android:test

.PHONY: submit-iod
submit-ios: ## Soumettre un build de l'application (IOS)
	@eas submit --platform ios --profile prod

.PHONY: submit-ios-test
submit-ios-test: ## Soumettre un build de l'application (IOS)
	@eas submit --platform ios --profile test
