# Guide Docker - Employee Management App

Guide complet pour déployer l'application avec Docker.

## 🚀 Démarrage rapide

```bash
# Lancer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

## 📦 Services

### MySQL
- **Port** : 3306
- **User** : `root`
- **Password** : `rootpassword`
- **Database** : `employees_db`
- **Volume** : `mysql_data` (persistance des données)

### Backend (Spring Boot)
- **Port** : 8080
- **Health Check** : `/actuator/health`
- **Build** : Multi-stage (Maven build + JRE runtime)
- **Image** : `eclipse-temurin:17-jre-alpine`

### Frontend (Angular + Nginx)
- **Port** : 4200 (mappé vers 80 dans le container)
- **Build** : Multi-stage (Node build + Nginx serve)
- **Image** : `nginx:alpine`

## 🔧 Configuration

### Variables d'environnement

Modifier dans `docker-compose.yml` :

```yaml
environment:
  SPRING_DATASOURCE_PASSWORD: rootpassword  # MySQL password
  SECURITY_JWT_SECRET: your-secret-key      # JWT secret
  MYSQL_ROOT_PASSWORD: rootpassword         # MySQL root password
```

### Ports personnalisés

Modifier dans `docker-compose.yml` :

```yaml
ports:
  - "8080:8080"  # Backend
  - "4200:80"    # Frontend
  - "3306:3306"  # MySQL
```

## 🛠️ Commandes utiles

### Build

```bash
# Reconstruire toutes les images
docker-compose build --no-cache

# Reconstruire un service spécifique
docker-compose build --no-cache backend
docker-compose build --no-cache frontend
```

### Logs

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Dernières 100 lignes
docker-compose logs --tail=100 backend
```

### Redémarrage

```bash
# Redémarrer tous les services
docker-compose restart

# Redémarrer un service
docker-compose restart backend
```

### Nettoyage

```bash
# Arrêter et supprimer les containers
docker-compose down

# Arrêter et supprimer les containers + volumes (⚠️ supprime les données)
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all
```

### Inspection

```bash
# Voir l'état des services
docker-compose ps

# Voir les ressources utilisées
docker stats

# Entrer dans un container
docker-compose exec backend sh
docker-compose exec mysql mysql -uroot -prootpassword
```

## 🐛 Dépannage

### Backend ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Vérifier que MySQL est prêt
docker-compose ps mysql

# Vérifier la connexion MySQL depuis le backend
docker-compose exec backend sh
# Dans le container: wget http://localhost:8080/actuator/health
```

### Frontend ne charge pas

```bash
# Vérifier les logs
docker-compose logs frontend

# Vérifier que Nginx fonctionne
docker-compose exec frontend nginx -t

# Vérifier les fichiers statiques
docker-compose exec frontend ls -la /usr/share/nginx/html
```

### MySQL ne démarre pas

```bash
# Vérifier les logs
docker-compose logs mysql

# Vérifier les permissions du volume
docker volume inspect atelier7_mysql_data

# Supprimer et recréer le volume (⚠️ perte de données)
docker-compose down -v
docker-compose up -d mysql
```

### Problèmes de réseau

```bash
# Vérifier le réseau Docker
docker network ls
docker network inspect atelier7_employees-network

# Tester la connectivité entre services
docker-compose exec backend ping mysql
docker-compose exec frontend ping backend
```

## 📝 Notes importantes

1. **Premier démarrage** : Le backend attend que MySQL soit prêt (health check)
2. **Données persistantes** : Les données MySQL sont stockées dans un volume Docker
3. **Hot-reload** : Non disponible en production Docker (utiliser `docker-compose.dev.yml` pour le dev)
4. **Sécurité** : Changez les mots de passe par défaut en production !

## 🔐 Sécurité en production

1. Changez tous les mots de passe dans `docker-compose.yml`
2. Utilisez des secrets Docker ou des variables d'environnement
3. Configurez un reverse proxy (Traefik, Nginx) devant les services
4. Activez HTTPS avec des certificats SSL
5. Limitez l'exposition des ports MySQL (ne pas exposer 3306 publiquement)

## 📚 Ressources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)

