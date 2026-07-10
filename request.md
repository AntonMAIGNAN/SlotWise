# Brief produit — SlotWise

**De :** Product Manager <br/>
**À :** Équipe technique <br/>
**Statut :** À cadrer et livrer

---

## Contexte

SlotWise est une startup qui vend un logiciel de réservation de créneaux à de petites structures : salles d'escalade, coachs sportifs, studios de tatouage, cabinets de kiné. Leur point commun : une ressource limitée (un mur, un praticien, une salle) réservable sur des créneaux horaires, et une clientèle qui réserve en ligne, parfois au même moment.

On a signé notre premier client pilote. Il nous a donné une seule exigence non négociable, héritée d'un très mauvais souvenir avec leur ancien prestataire :

> « Deux personnes ne doivent jamais pouvoir réserver le même créneau. Jamais. Même si elles cliquent à la même seconde. »

Le reste de l'outil, on peut le construire progressivement. Mais si cette garantie n'est pas fiable, le client ne signe pas le contrat annuel.

## Le problème à résoudre

Construire le cœur du système de réservation : la capacité à réserver un créneau de façon fiable, y compris quand plusieurs utilisateurs tentent de réserver le même créneau en même temps.

Tu es libre du langage, du framework, de la base de données, de l'architecture interne. Ce qui compte, c'est que le système tienne la promesse faite au client, et que tu puisses **prouver** qu'il la tient.

## Exigences fonctionnelles

- Un praticien (ou une ressource) expose une liste de créneaux disponibles sur une période donnée.
- Un client peut réserver un créneau disponible.
- Un créneau réservé n'est plus disponible pour personne d'autre.
- Un client peut annuler sa réservation, ce qui libère le créneau.
- Si deux requêtes de réservation arrivent en même temps sur le même créneau, une seule doit réussir ; l'autre doit échouer proprement, avec un message exploitable par le client final (pas une erreur 500 générique).
- Le système doit garder une trace de qui a réservé quoi et quand (même minimale), pour pouvoir répondre à un client qui conteste une réservation.

## Contraintes non-fonctionnelles (le vrai sujet)

- **Zéro double réservation**, même sous charge concurrente. C'est le critère d'acceptation numéro un.
- **Idempotence** : si le réseau du client final coupe et que son app retente automatiquement la même requête de réservation, ça ne doit pas créer deux réservations ni renvoyer une fausse erreur.
- **Observabilité minimale** : en cas d'incident, on doit pouvoir reconstituer ce qui s'est passé sur un créneau donné (qui a tenté quoi, dans quel ordre).
- Le système n'a pas besoin de scaler à des millions d'utilisateurs. Il doit être **correct avant d'être rapide**.

## Ce que j'attends comme livrable

Un dépôt Git public, avec :

1. **Un README** qui explique le problème (tu peux réutiliser ce brief), la solution retenue, et comment lancer le projet.
2. **Au moins un ADR** (Architecture Decision Record) qui documente comment tu as choisi de garantir l'absence de double réservation, avec les alternatives envisagées et pourquoi tu as tranché ainsi.
3. **Un test qui prouve la garantie anti-double-réservation** sous concurrence réelle (pas un test qui se contente d'appeler la fonction deux fois séquentiellement — il doit vraiment déclencher la course).
4. **Une suite de tests** raisonnable sur le reste des règles métier.
5. Le code doit tourner en local avec des instructions claires (idéalement une seule commande).

## Hors scope (volontairement)

- Authentification et gestion des comptes utilisateurs
- Interface graphique soignée — une UI minimale ou une API testable via des requêtes suffit
- Paiement, notifications, multi-langue
- Scalabilité à grande échelle, multi-région, haute dispo

Le but n'est pas de construire SlotWise en entier, mais de prouver que tu sais construire le cœur du système correctement, et documenter pourquoi tes choix tiennent la route.

## Grille d'évaluation (comment je jugerai le rendu)

| Critère                               | Ce que je regarde                                                                                                     |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Rigueur de la garantie anti-collision | Le test de concurrence est-il convaincant ? Le mécanisme choisi est-il le bon niveau de complexité pour le problème ? |
| Clarté de la décision d'architecture  | L'ADR explique-t-il un vrai compromis, ou se contente-t-il de justifier un choix déjà fait ?                          |
| Qualité du code                       | Lisible, testé, pas sur-ingénié pour un scope de ce type                                                              |
| Communication                         | Un développeur senior externe peut-il comprendre le projet en 5 minutes de lecture du README ?                        |

---

_Fin du brief. À toi de jouer._
