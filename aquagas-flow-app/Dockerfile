FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install -g expo-cli
RUN npm install
COPY . ./
EXPOSE 4000
CMD ["npm", "run", "start"]