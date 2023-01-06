# Craft GraphQL
Craft comes with a robust GraphQL API out of the box, but only if you are a Craft Pro user. Luckily, on local machines we can upgrade for free.

### Upgrading to Pro
1. Go to '/plugin-store' and click 'Upgrade Craft CMS'
2. Click 'Try for Free' and wait for install
3. GraphQL should show up in the side panel

## Setting up GraphQL
1. Go to the GraphQL admin panel
2. Click 'Schemas'
3. Click 'Public Schema'
4. Toggle boxes for content we want to query
	- Blog
	- Assets
	- Global Sets
5. Click 'Enabled' in right corner and save changes

## [GQL Explorer](https://craftcms.com/docs/4.x/graphql.html#query)
1. Go to '/admin/graphiql'
2. Lets create a query for our first blog post:
```gql
query MyQuery {
  entries(section: "blog") {
    id
    title
    ... on blog_default_Entry {
      subtitle
      featuredImage {
        url
      }
    }
  }
}
```
3. Now lets create a query for our globals:
```gql
query MyQuery {
  globalSet {
    ... on global_GlobalSet {
      name
      siteDescription
      siteTitle
    }
  }
}
```
## Preparing for NextJS

### [Expose GQL Outside of Craft](https://craftcms.com/docs/4.x/graphql.html#mutation)
By default the GQL endpoint is only available to Craft. We need to expose it to the outside world so that NextJS can access it.

1. Open ['config/routes.php'](../cms/config/routes.php)
2. Add the the GQL route:
```php
return [
    'api' => 'graphql/api',
    // ...
];
```
3. Paste the following into your terminal:
```bash
curl -H "Content-Type: application/graphql" -d '{ping}' http://craftstarter.lndo.site/api

# Should return:
# {"data":{"ping":"pong"}}
```
