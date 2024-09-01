FROM node:18-alpine as BUILD
WORKDIR /app/kalinduautofe

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine as PROD 

WORKDIR /app/kalinduautofe

COPY --from=BUILD /app/kalinduautofe/dist/ /app/kalinduautofe/dist/

EXPOSE 8080

COPY package.json .
COPY vite.config.ts .

RUN npm install typescript 

EXPOSE 8080
# CMD ["npm", "run", "preview"]

