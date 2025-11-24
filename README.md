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

## 6. Scripts utiles

| Action | Commande |
| ------ | -------- |
| Tests backend | `cd backend && ./mvnw test` |
| Build backend | `cd backend && ./mvnw clean package` |
| Build frontend prod | `cd frontend && npm run build` |
| Lint frontend (si ajouté) | `npm run lint` |

---

## 7. Architecture technique

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

## 8. Tests manuels recommandés

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

## 9. Pistes d’amélioration

- Ajouter des comptes utilisateurs persistants (JPA) au lieu d’un `InMemoryUserDetailsManager`.
- Exposer des rôles différents (ADMIN vs USER) et restreindre certaines actions.
- Dockeriser MySQL + backend + frontend.
- Mettre en place des tests E2E (Cypress, Playwright) et un pipeline CI/CD.
- Internationalisation côté Angular et messages i18n côté backend.

---

Bonne exploration ! Toute question ou contribution est la bienvenue. 💡

