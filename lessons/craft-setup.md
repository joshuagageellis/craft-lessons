# Craft CMS Setup
First, we need to install and setup our basic Craft instance. We will be using Lando as our dev server (since we are all familiar). Basic setup steps are available [here](https://craftcms.com/docs/getting-started-tutorial/install/).

1. Copy lando sample to cms directory. We will be using lando composer to install craft.
- From root of project: `cp .lando-sample.yml cms/.lando.yml`
	- We are using `craftstarter` as our project name, this can be changed but will change the url of the site.
- Start Lando: `lando start`
  - Lando must be running on php@8.1 

2. Install Craft via lando composer
- `cd cms`
- `lando composer create-project craftcms/craft tmp --no-scripts`
- Move into cms dir: `mv tmp/* .`
- Move hidden files to cms dir: `mv tmp/.* .`
- Delete tmp dir: `rm -rf tmp`

3. Setup .env file
- `cp .env.example.dev .env`
- Get lando services info and update the env file: `lando info` or from our lando config file
```yml
CRAFT_DB_SERVER=database
CRAFT_DB_PORT=3306
CRAFT_DB_DATABASE=craftstarter
CRAFT_DB_USER=craft
CRAFT_DB_PASSWORD=craft
```

3. Install Craft via lando composer
- `lando php craft install`
- Follow admin user setup steps
  - Admin
	- Email
	- Password: 'testtest'
	- Site url: `http://craftstarter.lndo.site` (must match the lando name and url)
- It is likely this process will error out, that is ok. Craft should autogenerate the App ID and Security key in the .env file — that is the main purpose here.

4. Go to the site url and finish install or login: [http://craftstarter.lndo.site/admin/](http://craftstarter.lndo.site/admin/)