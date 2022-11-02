FROM node:18

WORKDIR /opt/wall-of-fame

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

# ENTRYPOINT [ "yarn" ]
CMD [ "yarn" , "start" ]

