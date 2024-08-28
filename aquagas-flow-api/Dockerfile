FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm uninstall bcrypt
RUN npm install bcrypt
EXPOSE 80
CMD ["npm", "run", "dev"]