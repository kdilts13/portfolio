FROM node:24-alpine

RUN apk add --no-cache openjdk21-jre

RUN npm install --global firebase-tools

WORKDIR /workspace

CMD ["firebase", "emulators:start", \
     "--config", "./firebase.json", \
     "--only", "auth,firestore", \
     "--project", "portfolio-dev", \
     "--import", "./.firebase/data", \
     "--export-on-exit"]
