FROM node:alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app
COPY package-lock.json /app
RUN npm ci --silent
RUN npm install  -g --silent
COPY . ./

EXPOSE 5500
CMD ["npm", "start"]
