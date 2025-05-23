#!/bin/bash
echo "Aguardando LocalStack iniciar..."
sleep 5
aws --endpoint-url=http://localstack:4566 s3 mb s3://send-file-bucket || true
