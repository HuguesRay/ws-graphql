# DCI Workshop - GraphQL, volet pratique

## Ce que vous aurez à implémenter

Vous aurez à implémenter une API GraphQL qui effectue des analyses statistiques sur les données ouvertes de la ville de Montréal. L'API à implémenter interrogera une API GraphQL qui aura déjà formaté trois ensembles de données.

L'ensemble des requêtes et resolvers à implémenter se trouve dans le fichier [`schema.graphql`](./src/schema.graphql). Ce même fichier contient la documentation nécessaire pour comprendre l'objectif de la requête.

---

## Les ensembles de données

Les ensembles de données se trouvent sur cet [API](https://api.goyette.dev). Sur ce lien, vous trouverez un Playground afin que vous puissiez interagir avec les données de la ville de Montréal. L'API fournit trois ensembles de données:

- Le comptage des véhicules et piétons aux intersections de la ville de Montréal, de 2014 à 2018.
- Les infractions aux inspections alimentaires
- Les interventions policières de 2015 à 2019.

Dans le Playground, vous trouverez la documentation pour les données ouvertes.

---

## Les ressources fournis

Le Starter Pack vous fournit un gabarit de projet GraphQL avec le schéma des requêtes à implémenter. L'initialisation du serveur est déjà implémentée. Il ne reste donc qu'à implémenter les resolvers dans `src/resolvers/Query.js`.

### Démarrage

Avant de débuter, assurez-vous d'avoir effectué les étapes suivantes:

1.  Clôner le présent repo.
1.  Installer les dépendances (`npm install`)
1.  rouler la commande (`npm run dev`)

La commande `npm run dev` démarrera votre application avec Nodemon. Ainsi, à chaque modification que vous effectuez dans un fichier `.js`, Nodemon redémarrera automatiquement votre API.

---

## Les défis

Dans le but de valider votre compréhension, chacune des requêtes implémentées est reliée à un défi dans le [CTFD](https://goyette.dev). Les défis poseront donc une question en lien avec la requête implémentée. Dans les défis, vous pouvez également lire le format de la réponse.

### Les défis _Impressione-moi_.

Ces défis vous permettront d'interagir avec le schéma pour implémenter trois nouvelles requêtes (et potentiellement trois nouveaux types).

Pour réussir ce défi, il faut présenter une statistique intéressante avec les trois jeux de données mentionnées. **Par statistique intéressante, j'entends une statistique que je ne pourrais pas produire sur Excel en quelques clics.**

Une fois que vous pensez avoir une statistique intéressante, faites-moi signe et si vous réussissez à m'impressioner, je vous donerrais un flag.
