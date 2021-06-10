# Full Stack Express Application with JwT / Sessions / PassportJS local Startegy / GOOGLE OAUTH 2.0

## Summary
Application implements a fullstack Express Application with DB (MongoDB), authorization (JwT, with cookie), JEST, and Google OAUTH 2.0

## Key Features
* CSRF Protection using Token
* Authentication Using Passport JS (Local Strategy and Google OAUTH 2.0)
* Unit Test with JEST, Super Test and Mongo-Memory-DB
* Authorization with JwT and Session Cookie

## Folder Structure - Express (Full-Stack)

```
├─ .env
├─ .gitignore
├─ .npmrc
├─ ReadMe.md
├─ buildspec.yml
├─ package.json
├─ public
│  ├─ favicon.ico
│  ├─ image
│  ├─ scripts.js
│  └─ style.css
└─ src
   ├─ app.js
   ├─ controllers
   │  └─ loaderControllers.js
   ├─ db
   │  └─ index.js
   ├─ index.js
   ├─ middleware
   │  └─ loaderRoute
   │     ├─ authAdmin.js
   │     ├─ authGeneral.js
   │     └─ formValidator.js
   ├─ migration
   │  └─ loader
   │     ├─ loaderMigration.js
   │     └─ logs
   ├─ models
   │  └─ loader
   │     ├─ index.js
   │     └─ loaderMethod.js
   ├─ routes
   │  └─ loaderRoutes.js
   ├─ seeders
   │  └─ admin.js
   ├─ services
   │  ├─ jwtService.js
   │  └─ passport.js
   ├─ utils
   │  ├─ bcryptFunctions.js
   │  └─ verifyFunction.js
   └─ views
      ├─ admin.hbs
      ├─ error.hbs
      ├─ index.hbs
      ├─ login.hbs
      ├─ partials
      │  └─ header.hbs
      ├─ register.hbs
      └─ user.hbs
```

## Application Setup
* Entry into the server with provisions to handle ES-6 modules in NodeJS app.js
* Entry into the server with only provisions for CommonJS in NodeJS app_cjs.js
* Bear bone express application, this is available for use in testing framwork e.g. JEST index.js
* 
```
# Run application
npm run dev

# Run test
npm run test:jest
```

## Mockup of Complete Application
![mockup using Lunacy App](./image/webpageMockup.png)

## License
Free to use. Kindly acknowledge owner
