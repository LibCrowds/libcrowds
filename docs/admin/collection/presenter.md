# Task Presenter

The task presenter is the component via which the microsite's users contribute
to tasks. For example, LibCrowds Viewer is one of the available taks presenters
that deals with the collection of Web Annotations for IIIF content.

Each type of task presenter provides a selection of configuration options that
can be set at the collection microsite level. These options will be applied to
all projects within the microsite.

The first options shown on the page is the 'Presenter Type', followed by the
available options for the selected presenter type, which are described in
further detail below.

## LibCrowds Viewer

The following settings are available for the LibCrowds Viewer task presenter.

| Setting                        | Description
|--------------------------------|------------------------------------------------------------------------------|
| Share Modal Text               | Text for the share modal (to include, for example, a link to a forum topic)  |
| Note Button Text               | Text for the note button                                                     |
| Submit Button Text             | Text for the submit button                                                   |
| Select Mode Confirmation Rules | Rules for when to display a confirmation dialogue in select mode (see below) |

### Select Mode Confirmation Rules

In select mode it is likely that you will require a different number of
annotations for each image, depending on what is being tagged. For example,
there may only be one date expected on each image but at least two titles. To
handle this, you can set rules to determine when a confirmation dialogue should
be shown to your users in order to provide some additional guidance.

Rules are set in terms of a `tag` and the `number required`, where the tag
corresponds to one of those specified when generating the tasks for a project.

When the user submits an answer each rule will be checked and, for the first
rule that doesn't pass, a message will be displayed in the following format:

```
You have selected {{ number_selected }} {{ tag }}.
There are usually at least {{ number required }} {{ tag }} shown on each image.
Are you sure that you want to submit you answer?
```
