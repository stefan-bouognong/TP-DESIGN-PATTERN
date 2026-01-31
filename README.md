# TP-DESIGN-PATTERN - Système de Vente de Véhicules

Ce projet est une application complète (full-stack) pour la gestion de la vente de véhicules, incluant un frontend moderne développé avec React et un backend robuste basé sur Spring Boot, Java, et une implémentation extensive de divers design patterns.

## Table des Matières
1. [Vue d'Ensemble du Projet](#1-vue-densemble-du-projet)
2. [Technologies Utilisées](#2-technologies-utilisées)
3. [Architecture du Projet](#3-architecture-du-projet)
4. [Configuration et Installation](#4-configuration-et-installation)
    - [Prérequis](#prérequis)
    - [Backend (Java/Spring Boot)](#backend-javaspring-boot)
    - [Frontend (React/TypeScript)](#frontend-reacttypescript)
5. [Fonctionnalités Clés](#5-fonctionnalités-clés)
6. [Design Patterns Implémentés (Backend)](#6-design-patterns-implémentés-backend)
7. [Endpoints API (Backend)](#7-endpoints-api-backend)
8. [Contributions](#8-contributions)
9. [Licence](#9-licence)

---

## 1. Vue d'Ensemble du Projet
Le système de vente de véhicules "DriveDeal" permet aux utilisateurs de parcourir un catalogue de véhicules, d'ajouter des articles à un panier, de passer des commandes (comptant ou à crédit), et de gérer leurs abonnements. Le côté administrateur offre des outils pour la gestion du catalogue de véhicules, des clients, des commandes, des promotions et la génération de documents. Le projet est conçu avec une attention particulière aux design patterns pour assurer modularité, flexibilité et maintenabilité.


## 2. Architecture du Projet
Le projet est structuré en deux applications distinctes :
*   `frontend/` : Contient l'application React/TypeScript.
*   `backend/` : Contient l'application Spring Boot/Java.

### Backend - Organisation des Paquets (backend/src/main/java/com/example/drive_deal)
*   `config` : Classes de configuration de l'application (CORS, Email, initialisation Admin).
*   `security` : Implémentation de la sécurité JWT (filtres, services JWT, détails utilisateur).
*   `entity` : Entités JPA représentant le modèle de données de la base de données. Utilise l'héritage `SINGLE_TABLE` pour les clients, véhicules et commandes.
*   `dto` : Data Transfer Objects pour la communication entre le frontend et le backend, et entre les couches de l'application. Inclut des validations.
*   `repository` : Interfaces Spring Data JPA pour l'accès aux données.
*   `service` : Couche de logique métier, où la plupart des design patterns sont implémentés et orchestrés.
*   `controller` : Contrôleurs REST exposant les API de l'application.
*   `domain` : Ce package est le cœur des implémentations des design patterns.
*   `exception` : Exceptions personnalisées et gestionnaire d'exceptions global.

## 3. Configuration et Installation

### Prérequis
*   **Java Development Kit (JDK) 17** ou plus récent.
*   **Maven** (version compatible avec Spring Boot 3).
*   **Node.js** (recommandé 18.x ou plus récent).
*   **Bun** ou **npm** ou **Yarn** comme gestionnaire de paquets pour le frontend.
*   **MySQL Server** (ou un autre SGBD configuré pour Spring Boot).
*   Un éditeur de code (VS Code, IntelliJ IDEA, Eclipse) avec les plugins Java/TypeScript/React nécessaires.

### Backend (Java/Spring Boot)

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/stefan-bouognong/TP-DESIGN-PATTERN.git
    cd TP-DESIGN-PATTERN
    ```

2.  **Configuration de la base de données :**
    *   Créez une base de données MySQL nommée `drive_deal`.


3.  **Compilation et exécution :**
    Naviguez vers le dossier `backend` et utilisez Maven pour compiler et exécuter l'application.

    ```bash
    cd backend
    mvn clean install
    mvn spring-boot:run
    ```
    L'application backend démarrera sur `http://localhost:8080` par défaut.

### Frontend (React/TypeScript)

1.  **Installation des dépendances :**
    Naviguez vers le dossier `frontend` et installez les dépendances. Vous pouvez utiliser `npm`, `yarn` ou `bun`.

    ```bash
    cd frontend
    # Avec npm
    npm install
    # Ou avec yarn
    yarn install
    # Ou avec bun (si bun est installé)
    bun install
    ```

2.  **Exécution de l'application :**
    ```bash
    # Avec npm
    npm run dev
    # Ou avec yarn
    yarn dev
    # Ou avec bun
    bun dev
    ```
    L'application frontend démarrera sur `http://localhost:5173` par défaut.

## 4. Fonctionnalités Clés

### Frontend
*   **Catalogue de Véhicules** : Affichage des véhicules avec diverses options de filtre, tri et recherche.
*   **Pages de Détails des Véhicules** : Informations détaillées sur chaque véhicule, y compris les médias (images, vidéos) et les spécifications.
*   **Panier d'Achats** : Ajout/suppression d'articles, gestion des quantités, options d'articles, calcul des totaux et de la TVA.
*   **Processus de Commande (Checkout)** : Étapes d'authentification, de livraison, de paiement (comptant/crédit) et de confirmation.
*   **Gestion des Abonnements** : Possibilité pour les clients de s'abonner à des notifications (nouveaux véhicules, promotions).
*   **Authentication Utilisateur** : Inscription et connexion pour les clients et les administrateurs.
*   **Interface Administrateur** : Tableaux de bord pour gérer les véhicules, les clients, les commandes, les promotions et les documents.
*   **Génération de Documents** : Affichage et téléchargement de bons de commande, certificats de cession, demandes d'immatriculation, factures (format PDF).


### Backend
*   **API RESTful** : Endpoints pour toutes les opérations CRUD sur les véhicules, clients, commandes, abonnements, etc.
*   **Authentification et Autorisation JWT** : Sécurisation des endpoints avec des tokens JWT.
*   **Gestion des Véhicules** : CRUD pour les voitures et scooters, gestion de la disponibilité et des promotions.
*   **Gestion des Clients** : Enregistrement de clients individuels et entreprises, avec gestion des filiales.
*   **Gestion des Commandes** : Création, suivi de statut, approbation de crédit.
*   **Génération de Documents** : Services pour générer des documents personnalisés à partir de templates HTML (factures, bons de commande, etc.) en PDF.
*   **Système de Notification** : Envoi d'e-mails pour divers événements (nouvelle commande, promotion, erreur système).
*   **Moteur de Catalogue Dynamique** : Services pour afficher les véhicules avec des décorations variées (animations, badges de solde, options, recommandations).
*   **Filtrage et Pagination** : Mécanismes robustes pour interroger de grandes collections de véhicules.

## 5. Design Patterns Implémentés (Backend)
Ce projet est un excellent exemple d'application des design patterns pour résoudre des problèmes de conception courants et améliorer la structure du code.

*   **Abstract Factory** : Pour la création de familles d'objets liés (voitures/scooters électriques ou essence).
    *   `VehicleFactory`, `ElectricVehicleFactory`, `GasolineVehicleFactory`.
*   **Adapter** : Pour convertir des documents HTML en PDF, permettant aux clients de travailler avec l'interface `PdfDocument`.
    *   `PdfDocumentAdapter`, `HtmlDocument`, `PdfDocument`.
*   **Bridge** : Pour découpler les abstractions de formulaire (Client, Véhicule, Commande) de leurs implémentations de rendu (HTML, Widget JSON).
    *   `Form`, `FormRenderer`, `HtmlFormRenderer`, `WidgetFormRenderer`.
*   **Builder** : Pour la construction étape par étape de liasses de documents complexes (ex: `CarDocumentBundleBuilder`, `ScooterDocumentBundleBuilder`).
    *   `DocumentBundleBuilder`, `DocumentBundleDirector`, `DocumentBundle`.
*   **Composite** : Pour représenter les hiérarchies de clients (clients individuels et entreprises avec filiales) et les traiter uniformément.
    *   `ClientComponent`, `ClientLeaf`, `ClientComposite`.
*   **Decorator** : Pour ajouter dynamiquement des responsabilités à l'affichage des véhicules (animations, promotions, options, recommandations).
    *   `VehicleDisplay`, `BasicVehicleDisplay`, `AnimationDecorator`, `SaleDecorator`, `OptionsDecorator`, `RecommendationDecorator`.
*   **Factory Method** : Pour déléguer l'instanciation de différents types de commandes (comptant ou à crédit) à des sous-classes.
    *   `OrderCreator`, `CashOrderCreator`, `CreditOrderCreator`.
*   **Iterator** : Pour parcourir les collections de véhicules de différentes manières (filtrées, paginées) sans exposer la structure sous-jacente.
    *   `CatalogIterator`, `VehicleCatalog`, `FilteredIterator`, `PaginatedIterator`.
*   **Observer** : Pour mettre en place un système de notification où des objets (observateurs) sont informés des changements d'état d'un autre objet (sujet) (ex: notifications client, notifications email admin).
    *   `Subject`, `Observer`, `CatalogSubject`, `ClientSubscriptionObserver`, `EmailNotificationObserver`.
*   **Singleton** : Pour garantir qu'une classe (comme `DocumentBundleTemplate` pour la gestion des templates de documents) n'ait qu'une seule instance.

## 6. Endpoints API (Backend)
La documentation interactive de l'API est disponible via Swagger UI après le démarrage de l'application backend.
Accédez à : `http://localhost:8080/swagger-ui.html`

Quelques routes principales :
*   `/api/auth/**` : Authentification (login, inscription, etc.)
*   `/api/vehicles/**` : Gestion des véhicules (CRUD)
*   `/api/catalog/**` : Accès au catalogue de véhicules avec différentes vues et décorations
*   `/api/clients/**` : Gestion des clients
*   `/api/orders/**` : Gestion des commandes
*   `/api/documents/**` : Génération et récupération de documents
*   `/api/subscriptions/**` : Gestion des abonnements clients
*   `/api/forms/**` : Rendus de formulaires dynamiques
*   `/api/iterator/**` : Gestion des itérateurs pour le catalogue
*   `/api/observer/test/**` : Endpoints de test pour le pattern Observer

## 7. Contributions
Les contributions sont les bienvenues ! N'hésitez pas à soumettre des pull requests ou à ouvrir des issues pour signaler des bugs ou suggérer des améliorations.

## 8. Licence
Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
