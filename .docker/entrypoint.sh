#!/bin/bash

npm install 
npm run build
npx typeorm migration:run -d dist/databasa.providers.js
npm run start:dev