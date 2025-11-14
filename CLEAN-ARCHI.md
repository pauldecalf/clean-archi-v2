# 🏗️ Guide de l'Architecture Clean (Hexagonale)

## 📖 Table des matières
1. [Qu'est-ce que la Clean Architecture ?](#quest-ce-que-la-clean-architecture-)
2. [Pourquoi utiliser cette architecture ?](#pourquoi-utiliser-cette-architecture-)
3. [Les principes fondamentaux](#les-principes-fondamentaux)
4. [Structure du projet](#structure-du-projet)
5. [Les différentes couches](#les-différentes-couches)
6. [Flux de données - Exemple concret](#flux-de-données---exemple-concret)
7. [Avantages et inconvénients](#avantages-et-inconvénients)
8. [Bonnes pratiques](#bonnes-pratiques)

---

## Qu'est-ce que la Clean Architecture ?

La **Clean Architecture** (aussi appelée **Architecture Hexagonale** ou **Ports & Adapters**) est une façon d'organiser le code de votre application pour la rendre :
- ✅ **Maintenable** : facile à modifier et faire évoluer
- ✅ **Testable** : facile à tester automatiquement
- ✅ **Indépendante** : ne dépend pas d'un framework ou d'une base de données spécifique
- ✅ **Compréhensible** : la logique métier est séparée des détails techniques

### 🎯 L'idée principale

Imaginez votre application comme un **oignon avec plusieurs couches** :
- Au **centre** : la logique métier (les règles de votre application)
- Autour : les couches techniques (base de données, API, interface utilisateur)

**Règle d'or** : Les couches internes ne connaissent JAMAIS les couches externes !

```
┌─────────────────────────────────────┐
│   🌐 Couche Externe (API, UI)      │
│   ┌───────────────────────────┐    │
│   │  🔌 Adaptateurs           │    │
│   │   ┌─────────────────┐     │    │
│   │   │  💼 Use Cases   │     │    │
│   │   │   ┌─────────┐   │     │    │
│   │   │   │ 🎯 Core │   │     │    │
│   │   │   │ Métier  │   │     │    │
│   │   │   └─────────┘   │     │    │
│   │   └─────────────────┘     │    │
│   └───────────────────────────┘    │
└─────────────────────────────────────┘
```

---

## Pourquoi utiliser cette architecture ?

### 🔍 Problèmes résolus

**Sans Clean Architecture :**
```typescript
// ❌ Mauvais : Tout est mélangé
export async function POST(request: Request) {
  const body = await request.json();
  // Connexion directe à la DB dans la route
  const user = await db.insert(users).values(body);
  return Response.json(user);
}
```

**Problèmes :**
- 🚫 Impossible de tester sans une vraie base de données
- 🚫 Si vous changez de base de données, vous devez modifier toutes vos routes
- 🚫 Difficile de réutiliser la logique ailleurs
- 🚫 Pas de validation ou de logique métier

**Avec Clean Architecture :**
```typescript
// ✅ Bon : Séparation des responsabilités
export async function POST(request: Request) {
  const body = await request.json();
  const controller = new CreateUserController();
  const result = await controller.handle(body);
  return NextResponse.json(result);
}
```

**Avantages :**
- ✅ La route ne fait que recevoir et renvoyer des données
- ✅ La logique est dans le contrôleur et les use cases
- ✅ Facile à tester avec des mocks
- ✅ Facile à réutiliser

---

## Les principes fondamentaux

### 1️⃣ Inversion de dépendances (DIP)

Les couches internes (métier) ne dépendent PAS des couches externes (technique).
On utilise des **interfaces** pour inverser la dépendance.

```typescript
// ✅ Le Use Case dépend de l'INTERFACE, pas de l'implémentation
export class CreateNewUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  // La logique métier ne sait pas si on utilise PostgreSQL, MongoDB ou autre
}
```

### 2️⃣ Séparation des préoccupations (SoC)

Chaque partie du code a une responsabilité unique et bien définie.

### 3️⃣ Testabilité

On peut remplacer les vraies dépendances par des fausses (mocks) pour tester.

---

## Structure du projet

Voici l'arborescence complète de notre application :

```
my-app/
│
├── 📁 app/                          # Next.js App Router (Couche Externe)
│   ├── 📁 api/                      # Routes API
│   │   └── 📁 users/
│   │       └── route.ts             # Point d'entrée HTTP pour les utilisateurs
│   ├── layout.tsx                   # Layout principal
│   ├── page.tsx                     # Page d'accueil
│   └── globals.css                  # Styles globaux
│
├── 📁 src/                          # Code source de l'architecture Clean
│   │
│   ├── 📁 entities/                 # 🎯 COUCHE 1 : Entités (Cœur métier)
│   │   ├── user.ts                  # Définition de l'entité User
│   │   └── post.ts                  # Définition de l'entité Post
│   │
│   ├── 📁 repository/               # 💼 COUCHE 2 : Use Cases & Interfaces
│   │   ├── 📁 use-cases/            # Cas d'utilisation (logique métier)
│   │   │   └── create-new-user.use-case.ts
│   │   ├── 📁 mocks/                # Implémentations factices pour les tests
│   │   │   └── user.mock.repository.interface.ts
│   │   └── user.repository.interface.ts  # Interface du repository
│   │
│   ├── 📁 ports/                    # 🔌 COUCHE 3 : Ports (Implémentations)
│   │   └── user-repository.ts       # Implémentation réelle du repository
│   │
│   └── 📁 adapters/                 # 🔧 COUCHE 4 : Adaptateurs
│       ├── 📁 controllers/          # Contrôleurs (orchestrent les use cases)
│       │   └── create-user-controller.ts
│       └── 📁 validations/          # Validations des données entrantes
│           └── create-user-validation.ts
│
├── 📁 database/                     # Configuration de la base de données
│   ├── db.ts                        # Connexion à la DB
│   └── schema.ts                    # Schéma de la base de données (Drizzle ORM)
│
├── 📁 drizzle/                      # Migrations de base de données
│   ├── 0000_old_shinko_yamashiro.sql
│   ├── 0001_fast_grim_reaper.sql
│   └── 📁 meta/
│
├── 📁 docker/                       # Configuration Docker
│   └── docker-compose.yml           # Pour lancer PostgreSQL en local
│
├── 📁 public/                       # Fichiers statiques (images, SVG...)
│
├── package.json                     # Dépendances du projet
├── tsconfig.json                    # Configuration TypeScript
├── drizzle.config.ts                # Configuration Drizzle ORM
├── next.config.ts                   # Configuration Next.js
└── README.md                        # Documentation du projet
```

---

## Les différentes couches

### 🎯 COUCHE 1 : Entités (`src/entities/`)

**Rôle** : Définir les objets métier de l'application (les "choses" dont parle votre application)

**Caractéristiques** :
- Pas de dépendances externes
- Contient uniquement la structure des données
- Types TypeScript purs

**Exemple : `user.ts`**
```typescript
// Définition de ce qu'est un utilisateur dans notre application
interface User {
    id: string;
    name: string;
    lastname: string;
    mail: string;
    password: string;
}

// Types dérivés pour différents contextes
export type UserType = User;
export type UserConnectedType = Omit<UserType, "password">;  // Sans mot de passe
export type UserSignInType = Pick<UserType, "mail" | "password">;  // Connexion
```

**📝 Analogie** : C'est comme la **définition dans un dictionnaire**. Elle dit ce qu'est un utilisateur, mais pas comment le créer ou le manipuler.

---

### 💼 COUCHE 2 : Use Cases & Repository Interface (`src/repository/`)

**Rôle** : Contenir la logique métier de l'application (les règles de votre business)

#### A) Repository Interface (`user.repository.interface.ts`)

**C'est quoi ?** Un **contrat** qui définit les opérations possibles sur les utilisateurs.

```typescript
// Interface = contrat que toute implémentation doit respecter
export interface IUserRepository {
    createUser(payload: Omit<UserType, "id">): Promise<UserConnectedType>;
    getAllUsers(): Promise<UserType[]>;
    getUserByMail(mail: string): Promise<UserConnectedType | null>;
    getUserById(id: string): Promise<UserConnectedType | null>;
    userConnect(payload: UserSignInType): Promise<UserConnectedType | null>;
}
```

**📝 Analogie** : C'est comme un **menu de restaurant**. Il liste ce qui est disponible, mais ne dit pas comment c'est cuisiné.

#### B) Use Cases (`use-cases/create-new-user.use-case.ts`)

**C'est quoi ?** La **logique métier** de votre application. Ce sont les règles que doit respecter votre business.

```typescript
export class CreateNewUserUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(payload: Omit<UserType, "id">): Promise<UserConnectedType> {
        // 🔍 RÈGLE MÉTIER : Un utilisateur doit avoir un email unique
        const userExist = await this.userRepository.getUserByMail(payload.mail);
        
        if (userExist) {
            throw new Error("User already exist");
        }

        // Si tout est OK, on crée l'utilisateur
        return this.userRepository.createUser(payload);
    }
}
```

**📝 Analogie** : C'est comme une **recette de cuisine**. Elle décrit les étapes à suivre, mais ne se préoccupe pas de savoir si vous cuisinez au gaz ou à l'électricité.

**💡 Important** : Le Use Case ne sait PAS comment les données sont stockées (PostgreSQL ? MongoDB ? Fichier ?). Il utilise juste l'interface.

---

### 🔌 COUCHE 3 : Ports / Implémentations (`src/ports/`)

**Rôle** : Implémenter concrètement les interfaces définies dans la couche 2

**Exemple : `user-repository.ts`**
```typescript
export class UserRepository implements IUserRepository {
    async createUser(user: Omit<UserType, "id">): Promise<UserConnectedType> {
        // 🗄️ ICI on parle à la vraie base de données PostgreSQL
        const [createdUser] = await db
            .insert(users)
            .values(user)
            .returning();
        
        // On retourne l'utilisateur sans son mot de passe
        return {
            id: createdUser.id,
            name: createdUser.name,
            lastname: createdUser.lastname,
            mail: createdUser.mail
        };
    }
    // ... autres méthodes
}
```

**📝 Analogie** : C'est la **vraie cuisine**. Ici on utilise de vrais outils (Drizzle ORM) et de vraies ressources (PostgreSQL).

**💡 Pourquoi c'est puissant ?**
Si demain vous voulez utiliser MongoDB au lieu de PostgreSQL, vous n'avez qu'à :
1. Créer une nouvelle classe `MongoUserRepository`
2. La faire implémenter `IUserRepository`
3. Remplacer l'injection dans le contrôleur

**Les Use Cases n'ont pas besoin de changer !** 🎉

---

### 🔧 COUCHE 4 : Adaptateurs (`src/adapters/`)

**Rôle** : Faire le pont entre le monde extérieur et votre logique métier

#### A) Validations (`validations/create-user-validation.ts`)

**C'est quoi ?** Validation des données entrantes (de l'API, du formulaire...)

```typescript
// Utilise Zod pour valider la structure des données
export const createUserValidation = z.object({
    name: z.string(),
    lastname: z.string(),
    mail: z.string(),
    password: z.string(),
});
```

**📝 Analogie** : C'est le **vigile à l'entrée**. Il vérifie que les données sont bien formées avant de les laisser entrer.

#### B) Controllers (`controllers/create-user-controller.ts`)

**C'est quoi ?** L'**chef d'orchestre** qui coordonne tout.

```typescript
export class CreateUserController {
    private createNewUserUseCase: CreateNewUserUseCase;

    constructor() {
        // 🔌 Injection de dépendances : on connecte les pièces
        const userRepository = new UserRepository();
        this.createNewUserUseCase = new CreateNewUserUseCase(userRepository);
    }

    async handle(requestBody: Omit<UserType, "id">) {
        try {
            // 1️⃣ Validation des données
            const validatePayload = createUserValidation.safeParse(requestBody);
            if (!validatePayload.success) {
                return { success: false, error: "invalid payload" };
            }

            // 2️⃣ Validation spécifique (email)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(requestBody.mail)) {
                return { success: false, error: "Invalid email format" };
            }

            // 3️⃣ Exécution de la logique métier
            const createdUser = await this.createNewUserUseCase.execute(requestBody);

            // 4️⃣ Retour du résultat
            return { success: true, data: createdUser };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
}
```

**📝 Analogie** : C'est le **maître d'hôtel** d'un restaurant qui :
1. Accueille le client (reçoit les données)
2. Vérifie qu'il a réservé (validation)
3. Transmet la commande au chef (use case)
4. Apporte le plat (retourne le résultat)

---

### 🌐 COUCHE 5 : API Routes (`app/api/users/route.ts`)

**Rôle** : Point d'entrée HTTP de l'application

```typescript
export async function POST(request: Request) {
    // 1️⃣ Récupération des données de la requête HTTP
    const body = await request.json();
    
    // 2️⃣ Délégation au contrôleur
    const controller = new CreateUserController();
    const result = await controller.handle(body);

    // 3️⃣ Transformation en réponse HTTP
    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result.data, { status: 201 });
}
```

**📝 Analogie** : C'est la **porte d'entrée du restaurant**. Elle ne fait que ouvrir/fermer et diriger les clients vers le maître d'hôtel.

---

## Flux de données - Exemple concret

Imaginons qu'un utilisateur veut créer un compte. Voici le parcours complet des données :

```
1️⃣ CLIENT (Navigateur)
   │
   │ POST /api/users
   │ { "name": "Paul", "lastname": "Decalf", 
   │   "mail": "paul@example.com", "password": "secret123" }
   │
   ↓
   
2️⃣ ROUTE API (app/api/users/route.ts)
   │ Reçoit la requête HTTP
   │ Parse le JSON
   ↓
   
3️⃣ CONTROLLER (adapters/controllers/create-user-controller.ts)
   │ ✅ Valide les données avec Zod
   │ ✅ Vérifie le format de l'email
   │ Prépare l'appel au Use Case
   ↓
   
4️⃣ USE CASE (repository/use-cases/create-new-user.use-case.ts)
   │ 🔍 Vérifie si l'email existe déjà (règle métier)
   │ Si OK, demande la création
   ↓
   
5️⃣ REPOSITORY (ports/user-repository.ts)
   │ 🗄️ Communique avec PostgreSQL via Drizzle ORM
   │ INSERT INTO users VALUES (...)
   │ Retourne l'utilisateur créé
   ↓
   
6️⃣ REMONTÉE (Use Case → Controller → Route → Client)
   │ Use Case retourne UserConnectedType (sans password)
   │ Controller formate la réponse { success: true, data: {...} }
   │ Route transforme en réponse HTTP 201
   │
   ↓
   
7️⃣ CLIENT (Navigateur)
   Reçoit { "id": "...", "name": "Paul", "lastname": "Decalf", 
            "mail": "paul@example.com" }
```

### 🎨 Diagramme visuel

```
┌─────────────────────────────────────────────────────────────┐
│                     🌐 CLIENT (Frontend)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP Request
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              📡 API Route (app/api/users/route.ts)          │
│                   (Couche Présentation)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│         🎮 Controller + Validation (adapters/)              │
│                   (Couche Adaptateurs)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│           💼 Use Case (repository/use-cases/)                │
│                  (Couche Logique Métier)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓ (via Interface)
┌─────────────────────────────────────────────────────────────┐
│            🔌 Repository (ports/)                            │
│                (Couche Infrastructure)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│               🗄️ PostgreSQL Database                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Avantages et inconvénients

### ✅ Avantages

1. **Testabilité** 🧪
   - Chaque couche peut être testée indépendamment
   - On peut remplacer la vraie DB par un mock pour tester

2. **Maintenabilité** 🔧
   - Code organisé et facile à retrouver
   - Modification d'une couche n'impacte pas les autres

3. **Indépendance** 🆓
   - Changement de framework possible sans tout casser
   - Changement de base de données facile

4. **Réutilisabilité** ♻️
   - Les Use Cases peuvent être utilisés dans plusieurs contextes
   - Exemple : même Use Case pour API REST et GraphQL

5. **Collaboration** 👥
   - Structure claire pour travailler en équipe
   - Chacun peut travailler sur une couche différente

### ❌ Inconvénients

1. **Complexité initiale** 📚
   - Plus de fichiers et de dossiers
   - Courbe d'apprentissage pour les débutants

2. **Boilerplate** 📝
   - Plus de code à écrire au début
   - Peut sembler "over-engineering" pour petits projets

3. **Performance** ⚡
   - Légèrement plus lent (plusieurs couches à traverser)
   - Négligeable dans la plupart des cas

### 🤔 Quand utiliser la Clean Architecture ?

**✅ OUI pour :**
- Applications moyennes à grandes
- Projets avec logique métier complexe
- Applications qui évolueront beaucoup
- Projets en équipe
- Applications critiques (finance, santé...)

**❌ NON pour :**
- Prototypes rapides
- Petites applications simples (todo list, blog personnel...)
- Projets avec deadline très courte

---

## Bonnes pratiques

### 1. Nommage cohérent

```
✅ Bon :
- create-user-controller.ts
- create-new-user.use-case.ts
- user.repository.interface.ts

❌ Mauvais :
- controller.ts
- useCase.ts
- interface.ts
```

### 2. Un Use Case = Une action métier

```typescript
✅ Bon : Un Use Case par action
- CreateNewUserUseCase
- UpdateUserProfileUseCase
- DeleteUserUseCase

❌ Mauvais : Tout dans un Use Case
- UserUseCase (avec create, update, delete...)
```

### 3. Les entités doivent être "pures"

```typescript
✅ Bon : Juste des types
interface User {
    id: string;
    name: string;
}

❌ Mauvais : Logique dans l'entité
class User {
    async save() { /* logique DB */ }
}
```

### 4. Les Use Cases ne connaissent que les interfaces

```typescript
✅ Bon : Dépend de l'interface
constructor(private repo: IUserRepository) {}

❌ Mauvais : Dépend de l'implémentation
constructor(private repo: UserRepository) {}
```

### 5. Validation à la frontière

La validation doit se faire dans les adaptateurs (controllers), pas dans les Use Cases.

```typescript
✅ Bon : Validation dans le Controller
class CreateUserController {
    async handle(body: any) {
        const valid = schema.parse(body); // Zod validation
        return this.useCase.execute(valid);
    }
}

❌ Mauvais : Validation dans le Use Case
class CreateNewUserUseCase {
    async execute(body: any) {
        if (!body.email) throw new Error(); // ❌
    }
}
```

---

## 📚 Pour aller plus loin

### Concepts avancés

1. **Injection de dépendances (DI)** : Utiliser un container DI (ex: TSyringe, InversifyJS)
2. **CQRS** : Séparer les commandes (write) des queries (read)
3. **Event Sourcing** : Stocker les événements plutôt que l'état
4. **Domain Events** : Communication entre Use Cases via événements

### Ressources recommandées

- 📖 "Clean Architecture" par Robert C. Martin (Uncle Bob)
- 📖 "Domain-Driven Design" par Eric Evans
- 🎥 Vidéos YouTube sur l'architecture hexagonale
- 🌐 Articles sur dev.to et medium.com

---

## 🎯 Résumé en 30 secondes

**La Clean Architecture en une phrase :**
> "Séparer la logique métier (ce que fait l'app) des détails techniques (comment elle le fait)"

**Les 4 couches essentielles :**
1. 🎯 **Entities** : Qu'est-ce qu'un utilisateur, un post ?
2. 💼 **Use Cases** : Quelles sont les règles métier ?
3. 🔌 **Repositories** : Comment accéder aux données ?
4. 🔧 **Controllers** : Comment recevoir/envoyer les données ?

**La règle d'or :**
> Les couches internes ne dépendent JAMAIS des couches externes

---

## 💡 Questions fréquentes

### Q1 : Est-ce que c'est trop compliqué pour mon projet ?
**R :** Si votre projet a plus de 3 écrans et va évoluer, OUI c'est utile. Si c'est un petit prototype, NON c'est probablement trop.

### Q2 : Dois-je toujours créer une interface ?
**R :** OUI pour tout ce qui touche à l'infrastructure (DB, API externes). NON pour les Utils simples.

### Q3 : Où mettre les fonctions utilitaires (utils) ?
**R :** Créez un dossier `src/utils/` séparé. Les utils n'ont pas de logique métier.

### Q4 : Comment tester cette architecture ?
**R :** 
- **Use Cases** : Testez avec des mock repositories
- **Controllers** : Testez avec des mock use cases
- **Repositories** : Tests d'intégration avec une DB de test

### Q5 : Quelle est la différence entre Repository et UseCase ?
**R :** 
- **Repository** : Accès aux données (CRUD basique)
- **Use Case** : Logique métier (règles, orchestration)

---

## 🙏 Conclusion

La Clean Architecture peut sembler intimidante au début, mais elle apporte une **structure solide** à votre code. Avec le temps, vous apprécierez :
- La facilité de retrouver et modifier du code
- La possibilité de tester facilement
- La flexibilité pour faire évoluer votre application

**N'oubliez pas** : L'architecture est un **outil**, pas un dogme. Adaptez-la à vos besoins !

---

Créé avec ❤️ pour rendre l'architecture accessible à tous

