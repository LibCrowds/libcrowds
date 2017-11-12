# Collection Admin

This section contains a series of pages via which users with admin rights can
manage the platform's collection microsites.

## Open Collection

Here you can select the collection microsite that you wish to manage. Click
'Open' to display the all additional settings pages for a microsite.

## New Collection

To create a new collection specify a name and description, then click 'Create'.

Following creation you will be given access to a range of additional
configuration options, which are described in more detail below.

## Settings

This is where the core settings for the microsite are configured, each of which
are explained below.

| Setting            | Description
|--------------------|------------------------------------------------------------------------------------------------|
| Published          | Once published, a microsite is added to the platform homepage and is accessible to all users.  |
| Name               | Applies branding throughout the collection microsite.                                          |
| Short name         | Used as an identifier and to form the microsite endpoint (e.g. `/collection/short_name`).      |
| Tagline            | Appears over the hero image on the microsite's homepage and forms a part of it's title.        |
| Description        | Appearson the microsite's homepage and forms its meta description.                             |
| Background Image   | The URL for an image used to provide a consistent theme for all of the microsite's core pages. |
| Logo               | The URL for a logo to be shown alongside the name on the microsite's homepage.                 |
| Forum URL          | The URL for the Discuss link in the microsite's main navigation bar.                           |
| Task Presenter     | The module used to present tasks for all of the microsite's projects.                          |
| Data Reuse License | The license by which all data collected via the microsite is made available.                   |

## Content

A set of markdown editors are provided here for modifying content for the About,
Projects and Data pages. Changes are made in real-time, although you may have
to refresh your browser to see them.

For the About page, navigation items will be generated from each level two
header, created in Markdown by using the ## tag, for example:

```
## Contact

This is the contact details section.
```

These navigation items can be clicked to scroll the users window to the top
of that section.

For more guidance on the GitHub flavoured markdown used, see this
[GitHub Guide](https://guides.github.com/features/mastering-markdown/).

## Terminology

You can use the options provided here to modify the domain object terminology
used throughout the collection microsite. For instance, task could be renamed
to objective, or task run to contribution.

## Tags

Tags are used to help users more easily location the types of project within a
collection that they're interested in. For each tag type created via this
admin section a new filter will be added to the microsite's Contribute
page (among others).

![Collection Admin - Tags](../assets/admin-collection-tags.png?raw=true)

To add a new tag click the 'Add tag' button at the top of the table. You
will then be given options to choose a tag type (e.g. Location), a tag name
(e.g. London) and a colour. Note that the colour applies to all tags of the
same type.

Once tags are created they can be added to individual projects via the
[Project Admin](admin/project.md) section.

Tags can be edited or removed by locating them in the table and clicking the
corresponding buttons. If you want to edit the color for a particular tag type
just click edit on any tags of that type.

## Featured

Here you can set the projects that appear on the Featured Projects section of
the collection microsite's homepage.

![Collection Admin - Featured](../assets/admin-collection-featured.jpg?raw=true)

## Delete

Here you can permanently delete a collection microsite.
