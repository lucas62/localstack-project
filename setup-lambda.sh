#!/bin/bash

set -e

echo "📦 1. Criando buckets..."
aws --endpoint-url=http://localhost:4566 s3 mb s3://send-file-bucket || true
aws --endpoint-url=http://localhost:4566 s3 mb s3://send-file-bucket-output || true

echo "🧹 2. Removendo Lambda anterior (se existir)..."
aws --endpoint-url=http://localhost:4566 lambda delete-function \
  --function-name processarImagem 2>/dev/null || true

echo "📤 3. Criando nova função Lambda..."
aws --endpoint-url=http://localhost:4566 lambda create-function \
  --function-name processarImagem \
  --runtime nodejs14.x \
  --handler index.handler \
  --zip-file fileb://lambda/function.zip \
  --role arn:aws:iam::000000000000:role/lambda-role

echo "🔑 4. Adicionando permissão para o S3 invocar a Lambda..."
aws --endpoint-url=http://localhost:4566 lambda add-permission \
  --function-name processarImagem \
  --statement-id s3invoke-setup \
  --action "lambda:InvokeFunction" \
  --principal s3.amazonaws.com \
  --source-arn arn:aws:s3:::send-file-bucket

echo "🔗 5. Aplicando trigger S3 -> Lambda..."
aws --endpoint-url=http://localhost:4566 s3api put-bucket-notification-configuration \
  --bucket send-file-bucket \
  --notification-configuration file://lambda/notification.json

echo "🧪 6. Enviando imagem de teste..."
echo "TESTE" > lambda/teste.txt
aws --endpoint-url=http://localhost:4566 s3 cp lambda/teste.txt s3://send-file-bucket/teste.txt

echo "📂 7. Verificando saída no bucket processado:"
aws --endpoint-url=http://localhost:4566 s3 ls s3://send-file-bucket-output/
