FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY ./.dockerignore /
COPY ./src /src
COPY ./package.json /
#COPY ./package-lock.json /
COPY ./swagger.yaml /
COPY ./tsconfig.json /
COPY ./.npmrc /

RUN npm install --ignore-scripts
RUN npm run build
#RUN rm -f ./.npmrc

EXPOSE 8081

RUN addgroup --system nonroot 
RUN adduser --system --ingroup nonroot nonroot
USER nonroot

CMD [ "npm", "run", "start" ]
