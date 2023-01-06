# Craft Entries & Fields
 We are going to create some basic content for our site.

## [Entries](https://craftcms.com/docs/4.x/entries.html)
Entries hold the content that you want to display on your web pages. Each entry has an Author, a Post Date, an Expiration Date (if desired), a status (enabled or disabled), and of course, content.

In WP terms, these are post types.

### Sections
Sections contain entries. By default there are 3 sections availble in Craft, Singles, Channels, and Structures. We are going to create a new section called "Blog" and add some entries to it.

- Singles — A single entry that is used to hold content that is unique to your site, such as a homepage or an about page.
- Channels — A section that contains multiple entries that are related to each other, such as a blog or news section.
- Structures — A section that contains multiple entries that are related to each other and can be organized into a hierarchy, such as a site map or a knowledge base.

### Creating Our First Entry
1. Go to '/settings' and click 'Sections'
2. Create new section, called 'Blog'
3. Go to '/entries' and you will see our new content channel

### Creating Fields
1. Go to '/settings' and click 'Fields'
2. Create new group, called 'General Page Content'
3. Create new field, called 'Description'
```
	- Name: 'Description'
	- Handle: 'description'
	- Field Type: Plain Text
```

### Creating Image Fields
1. Go to '/settings' and click 'Filesystems'
2. We are going to create two filesystems, Images and ImagesTransform
```
	- Images
		- Name: 'Images'
		- Handle: 'images'
		- Public urls: true
		- Baseurl: '/assets/images'
		- Volume Type: Local
		- Basepath: '@webroot/assets/images'

	- ImagesTransform
		- Name: 'Images Transform'
		- Handle: 'imagesTransform'
		- Public urls: true
		- Baseurl: '/assets/images/transforms'
		- Volume Type: Local
		- Basepath: '@webroot/assets/images/transforms'
```
3. Go to '/settings' and click 'Fields'
4. Under our 'General Page Content' group, create a new field called 'Featured Image'
```
	- Name: 'Featured Image'
	- Handle: 'featuredImage'
	- Field Type: Assets
	- Sources: 'All'
	- Restrict file types to 'Image'
```

### Assign Fields to Entry Type
1. Go to our 'Blog' section and click 'Entry Types'
2. Click the 'Default' entry type
3. Drag and drop our fields into the admin
	* Notice you can add conditional settings and control display

### Creating Globals
1. Lets create a new field called 'Site Title' and 'Site Description' and put them under a new 'Globals' group
```
	- Name: 'Site Title'
	- Handle: 'siteTitle'
	- Field Type: Plain Text

	- Name: 'Site Description'
	- Handle: 'siteDescription'
	- Field Type: Plain Text
```
2. Go to '/settings' and click 'Globals'
3. Create a new global set called 'Globals'
4. Add our fields to the global set

## Lets go ahead and populate what we have created!

### Notes
- Notice there is no WYSIWYG editor. We can add this functionality via a plugin. [Redactor](https://craftstarter.lndo.site/admin/plugin-store/redactor) is a popular option. Creating the field is the same as what we have already done.