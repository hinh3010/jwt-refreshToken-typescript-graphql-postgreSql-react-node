## run code
- yarn watch
- yarn sv

# 
npm i pg apolo-server-express express apolo-server-core graphql typeorm type-graphql reflect-metadata class-validator dotenv argon2 cors jsonwebtoken

# 
yarn global add tsconfig.json

```json
"scripts": {
    "build": "del dist && tsc",
    "start": "node dist/index.js",
    "sv": "nodemon dist/index.js",
    "watch": "tsc -w"
},
"devDependencies": {
    "@types/cookie-parser": "^1.4.2",
    "@types/cors": "^2.8.12",
    "@types/express": "^4.17.13",
    "@types/jsonwebtoken": "^8.5.8",
    "@types/node": "^17.0.13",
    "nodemon": "^2.0.15",
    "typescript": "^4.5.5"
}
```