FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install -g cross-env
RUN npm install
COPY . ./
EXPOSE 3000
CMD ["npm", "run", "start"]