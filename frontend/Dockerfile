FROM node:18

WORKDIR /app

# Copiar só package.json e lock para instalar dependências com cache
COPY package*.json ./

# ⚠️ Fallback para evitar módulos nativos quebrados
ENV ROLLUP_WATCH=false
ENV VITE_ROLLUP_FORCE_JS=true
ENV SKIP_POSTINSTALL=true

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
