FROM node:latest

RUN apt-get update 
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y

# Create the bot's directory
RUN mkdir -p /usr/src/bot

WORKDIR /usr/src/bot

COPY package.json /usr/src/bot

RUN npm install

COPY . /usr/src/bot

RUN npx prisma generate

# Start the bot.
CMD ["npm","start"]