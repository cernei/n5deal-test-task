### Manual installation

Requirements: Node, NPM, php

```bash
php -S localhost:8000 backend/index.php

curl http://localhost:8000/reset # Migrate db

npm install
npm run dev
```

### Docker

```bash
docker build -t n5deal-test-task .
docker run -d -p 8000:8000 -p 3000:3000 --name n5deal-test-task n5deal-test-task
```