FROM oven/bun as builder

RUN apt update \
    && apt install -y curl unzip

RUN bun upgrade

# Insstall node for prisma's generate
ARG NODE_VERSION=18
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g npm


FROM builder as app

WORKDIR /home/bun/app

COPY package*.json bun.lockb ./

RUN bun install

COPY . .

RUN bunx prisma generate

ENV NODE_ENV production

CMD [ "bun", "start" ]