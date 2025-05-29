FROM node:22

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package.json package-lock.json ./

RUN npm install

# Then copy the rest of the app
COPY . .

# Expose Vite's default dev port
EXPOSE 5173

CMD ["npm", "run", "dev"]
