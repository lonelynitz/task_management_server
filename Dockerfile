FROM node:20-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install ALL dependencies (including dev for prisma generate)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push --skip-generate && node server.js"]
