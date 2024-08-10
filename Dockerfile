FROM node:18

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    build-essential \
    # openjdk-11-jdk \
    python3 \
    python3-pip 

WORKDIR /compiler-app

COPY package.json ./

RUN npm install

COPY . /compiler-app

EXPOSE 8080

CMD ["node", "index.js"]
