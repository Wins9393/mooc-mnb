FROM node
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --silent
COPY . .
RUN npm run build
EXPOSE 4000
RUN chown -R node /usr/src/app
USER node
CMD ["node", "./js-build/server.js"]
