# Atelier7 – Employee Management Full-Stack App

Application complète combinant une API Spring Boot sécurisée et un frontend Angular 17 pour gérer un annuaire d’employés (CRUD, auth JWT, formulaires réactifs).

---

## 1. Structure du dépôt

| Dossier | Description |
| ------- | ----------- |
| `backend/` | API REST Spring Boot 3.4 : MySQL, Spring Data JPA, Spring Security (JWT), Lombok, Jakarta Validation. |
| `frontend/` | SPA Angular 17 : routing standalone, AuthGuard, HttpClient, Reactive Forms, interceptor JWT. |

---

## 2. Prérequis techniques

- **Java** : JDK 17 (ou supérieur) + `JAVA_HOME` configuré
- **Maven** : 3.9+
- **Node.js / npm** : Node 18+ recommandé
- **MySQL** : base `employees_db` (créée automatiquement avec `createDatabaseIfNotExist=true`)

---

## 3. Configuration backend

Fichier : `backend/src/main/resources/application.properties`

Sections principales :

- `spring.datasource.*` : URL JDBC, utilisateur, mot de passe MySQL.
- `security.jwt.secret` : clé Base64 utilisée pour signer les tokens.
- `security.jwt.expiration` : durée de validité du JWT (ms).
- Configuration CORS (`spring.web.cors.*`) pour autoriser `http://localhost:4200`.

> 🔐 Pensez à changer la clé JWT et les identifiants MySQL avant de déployer.

---

## 4. Lancer l’API Spring Boot

```bash
cd backend
./mvnw spring-boot:run
# ou mvnw.cmd sous Windows
```

- Serveur : `http://localhost:8080`
- Endpoints principaux :
  - `POST /api/auth/login` : reçoit `{ "username": "admin", "password": "password123" }` ou `user`.
  - `GET /api/employees` : liste des employés (JWT requis).
  - `POST /api/employees` : création.
  - `PUT /api/employees/{id}` : mise à jour.
  - `DELETE /api/employees/{id}` : suppression.

Réponse type pour le login :

```json
{
  "accessToken": "<jwt>",
  "tokenType": "Bearer"
}
```

Ce token doit être envoyé dans l’en-tête `Authorization: Bearer <jwt>` pour toutes les routes `/api/employees`.

> 🧑‍💼 Un administrateur (`admin/password123`) est automatiquement inséré au démarrage via `DataInitializer`. Si vous modifiez ce compte, pensez à ajuster vos identifiants de test.

---

## 5. Lancer le frontend Angular

```bash
cd frontend
npm install      # une seule fois
npm start        # ng serve
```

- Adresse : `http://localhost:4200`
- Fonctionnalités :
  - Page de **login** avec Reactive Forms et gestion d’erreurs.
  - **Liste** des employés (table responsive + actions).
  - **Formulaire** de création/édition avec validations.
  - **Détails** d’un employé.
  - Navigation protégée par **AuthGuard** et stockage du JWT dans `localStorage`.

---

## 6. Déploiement avec Docker 🐳

L'application peut être déployée entièrement avec Docker et Docker Compose.

### Prérequis Docker

- **Docker** : version 20.10+
- **Docker Compose** : version 2.0+

### Lancer l'application complète

```bash
# À la racine du projet
docker-compose up -d
```

Cette commande va :
1. Construire les images Docker pour le backend et le frontend
2. Démarrer MySQL, le backend et le frontend
3. Créer automatiquement la base de données `employees_db`
4. Initialiser l'utilisateur admin (`admin/password123`)

### Accès aux services

- **Frontend** : http://localhost:4200
- **Backend API** : http://localhost:8080
- **MySQL** : localhost:3306
  - User: `root`
  - Password: `rootpassword`
  - Database: `employees_db`

### Commandes Docker utiles

```bash
# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données MySQL)
docker-compose down -v

# Reconstruire les images
docker-compose build --no-cache

# Redémarrer un service spécifique
docker-compose restart backend
```

### Structure Docker

- **`backend/Dockerfile`** : Build multi-stage (Maven build + JRE runtime)
- **`frontend/Dockerfile`** : Build Angular + Nginx pour servir les fichiers statiques
- **`docker-compose.yml`** : Orchestration des 3 services (MySQL, backend, frontend)
- **`frontend/nginx.conf`** : Configuration Nginx pour le routing Angular

### Variables d'environnement

Les variables peuvent être modifiées dans `docker-compose.yml` :

```yaml
environment:
  SPRING_DATASOURCE_PASSWORD: rootpassword  # Mot de passe MySQL
  SECURITY_JWT_SECRET: your-secret-key      # Clé JWT
  MYSQL_ROOT_PASSWORD: rootpassword         # Root MySQL
```

### Health Checks

Tous les services incluent des health checks :
- **MySQL** : ping toutes les 10s
- **Backend** : `/actuator/health` toutes les 30s
- **Frontend** : `/health` toutes les 30s

### Dépannage

Si le backend ne démarre pas :
```bash
# Vérifier les logs
docker-compose logs backend

# Vérifier que MySQL est prêt
docker-compose ps mysql
```

Si le frontend ne charge pas :
```bash
# Vérifier les logs
docker-compose logs frontend

# Vérifier que le backend répond
curl http://localhost:8080/actuator/health
```

### Build manuel des images

```bash
# Backend uniquement
cd backend
docker build -t employees-backend .

# Frontend uniquement
cd frontend
docker build -t employees-frontend .
```

---

## 7. Scripts utiles

| Action | Commande |
| ------ | -------- |
| Tests backend | `cd backend && ./mvnw test` |
| Build backend | `cd backend && ./mvnw clean package` |
| Build frontend prod | `cd frontend && npm run build` |
| Lint frontend (si ajouté) | `npm run lint` |

---

## 8. Architecture technique

- **Backend**
  - `Employee` (entity JPA) + `EmployeeRepository`
  - `EmployeeService` + `EmployeeServiceImpl`
  - `EmployeeController` (CRUD)
  - `AuthController` (authentification)
  - `JwtService`, `JwtAuthenticationFilter`, `SecurityConfig`
  - `GlobalExceptionHandler` pour harmoniser les réponses d’erreur

- **Frontend**
  - Modules standalone (pas de NgModule)
  - Routing lazy :
    - `/login`
    - `/employees`, `/employees/new`, `/employees/:id`, `/employees/:id/edit`
  - Services partagés : `AuthService`, `EmployeeService`, `authInterceptor`

---

## 9. Tests manuels recommandés

1. **Login**
   - Essayer un mauvais mot de passe → message d’erreur.
   - Se connecter avec `admin/password123` → redirection vers la liste.
2. **CRUD**
   - Créer un employé puis vérifier l’affichage dans la liste.
   - Modifier l’employé (email unique).
   - Supprimer l’employé.
3. **Sécurité**
   - Appeler `/api/employees` sans token → 401.
   - Appeler avec token expiré → 401.
4. **CORS**
   - Vérifier que les appels depuis `localhost:4200` fonctionnent (navigateur + devtools).

---

## 10. Pistes d'amélioration

- ✅ Dockeriser MySQL + backend + frontend (fait)
- Ajouter des comptes utilisateurs persistants (JPA) au lieu d'un `InMemoryUserDetailsManager`.
- Exposer des rôles différents (ADMIN vs USER) et restreindre certaines actions.
- Mettre en place des tests E2E (Cypress, Playwright) et un pipeline CI/CD.
- Internationalisation côté Angular et messages i18n côté backend.
- Ajouter des variables d'environnement pour la configuration Docker.

---

Bonne exploration ! Toute question ou contribution est la bienvenue. 💡

