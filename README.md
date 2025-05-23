# 🚀 Projeto Send-File (S3 + Lambda + Frontend)

Este projeto implementa:

- Upload de arquivos via frontend React
- Armazenamento em bucket S3 (emulado pelo LocalStack)
- Processamento de imagem (resize com Sharp) via Lambda
- Salvamento automático em outro bucket
- Backend em Node.js + Express
- Frontend em Vite + React

---

## ✅ Requisitos

- Node.js **18+**
- Docker
- AWS CLI (`aws`)
- LocalStack (rodando via Docker)
- `nvm` (opcional, mas recomendado)

---

## 🐳 1. Subir o LocalStack

Use este comando para subir o LocalStack com suporte à Lambda:

```bash
docker run --rm -it \
  -p 4566:4566 -p 4510-4559:4510-4559 \
  -e SERVICES=s3,lambda,iam \
  -e LAMBDA_EXECUTOR=docker \
  -e DOCKER_HOST=unix:///var/run/docker.sock \
  -v /var/run/docker.sock:/var/run/docker.sock \
  localstack/localstack
```

---

## 🛠️ 2. Preparar Lambda (empacotar `sharp` para Linux x64)

### Acesse a pasta:

```bash
cd lambda
```

### Crie o Dockerfile:

```Dockerfile
FROM public.ecr.aws/lambda/nodejs18.x as builder

WORKDIR /lambda
COPY . .

RUN npm install --omit=dev --platform=linux --arch=x64 sharp aws-sdk
RUN zip -r function.zip .
```

### Rode o Docker para gerar o `function.zip`:

```bash
docker build -t lambda-builder .
docker run --rm -v "$PWD":/lambda lambda-builder
```

---

## ☁️ 3. Criar buckets e Lambda

### Criar buckets:

```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://send-file-bucket
aws --endpoint-url=http://localhost:4566 s3 mb s3://send-file-bucket-output
```

### Criar função Lambda:

```bash
aws --endpoint-url=http://localhost:4566 lambda create-function \
  --function-name processarImagem \
  --runtime nodejs18.x \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::000000000000:role/lambda-role
```

### Adicionar permissão:

```bash
aws --endpoint-url=http://localhost:4566 lambda add-permission \
  --function-name processarImagem \
  --statement-id s3invoke \
  --action "lambda:InvokeFunction" \
  --principal s3.amazonaws.com \
  --source-arn arn:aws:s3:::send-file-bucket
```

### Criar `notification.json`:

```json
{
  "LambdaFunctionConfigurations": [
    {
      "LambdaFunctionArn": "arn:aws:lambda:us-east-1:000000000000:function:processarImagem",
      "Events": ["s3:ObjectCreated:*"]
    }
  ]
}
```

### Aplicar trigger:

```bash
aws --endpoint-url=http://localhost:4566 s3api put-bucket-notification-configuration \
  --bucket send-file-bucket \
  --notification-configuration file://notification.json
```

---

## 🧩 4. Backend (Node.js + Express)

### Acesse:

```bash
cd ../backend
```

### Instale:

```bash
npm install
```

### Crie `.env`:

```env
BUCKET_NAME=send-file-bucket
S3_ENDPOINT=http://localhost:4566/send-file-bucket
```

### Rode:

```bash
npx nodemon src/server.js
```

> API: http://localhost:3001

---

## 💻 5. Frontend (React + Vite)

### Acesse:

```bash
cd ../frontend
```

### Instale:

```bash
npm install
```

### Rode:

```bash
npm run dev
```

> Frontend: http://localhost:5173

---

## 🧪 6. Testar fluxo completo

1. Acesse `http://localhost:5173/upload`
2. Faça upload de uma imagem
3. Ela será enviada via backend para `send-file-bucket`
4. A Lambda será acionada automaticamente
5. A imagem redimensionada será salva em `send-file-bucket-output`
6. A lista será atualizada com link de download

---

## 🧼 Comandos úteis

### Verificar arquivos processados:

```bash
aws --endpoint-url=http://localhost:4566 s3 ls s3://send-file-bucket-output/
```

### Apagar Lambda:

```bash
aws --endpoint-url=http://localhost:4566 lambda delete-function \
  --function-name processarImagem
```

---

## 📦 Stack utilizada

- React + Vite
- Express + Node.js
- AWS SDK
- Sharp (imagem)
- LocalStack (S3, Lambda, IAM)

---

> Desenvolvido por Lucas Anselmo ✨
