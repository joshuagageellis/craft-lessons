# Next JS Setup
We will be setting up Next JS with TypeScript support. Apollo will be our GraphQL client.

1. From frontend dir, install nextjs with typescript support.
- `npx create-next-app@latest --typescript tmp`
  - Name: `app`
  - ESLint: `Yes`
- Move tmp dir to frontend dir
  - `mv tmp/* .`
  - Move hidden files to fe dir: `mv tmp/.* .`
  - Delete tmp dir: `rm -rf tmp`
- Or as an oneliner:
```shell
npx create-next-app@latest --typescript tmp; mv tmp/* .; mv tmp/.* .; rm -rf tmp;
```

2. Install Apollo Client & GraphQL
- `npm i @apollo/client graphql`

3. Generate security certificate
- `cd ..` (back to root)
- Copy code from https.sh to terminal and run
- Open [localhost.crt](../localhost.crt) and add cert to keychain
- Find cert in keychain and set to `Always Trust`

4. Add new local-server.ts file in fe root dir
- `touch local-server.ts`
```ts
const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("../localhost.key"),
  cert: fs.readFileSync("../localhost.crt"),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Server started on https://localhost:3000");
  });
});
```

5. Update package.json scripts
```json
 "scripts": {
   ...
    "dev-https": "node local-server.ts"
  },
```

6. Run next with certificate
- `npm run dev-https`