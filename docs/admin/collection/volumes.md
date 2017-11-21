# Volumes

Volumes provide a way of further grouping projects within a collection
microsite and recording a list of sources from which projects can later be
generated. The list of volumes provides a way of checking which projects have
been completed for a particular volume and those that still need to be created.

The details recorded for each volume are `name` and `source`, with the source
being a URL pointing to the input for the project, for example, a IIIF
manifest ID.

As these lists of volumes may become quite long, they are uploaded to the
platform as a CSV file. The CSV file should contain two columns, with the
names in the first column and the associated sources in the second. The CSV
file should not contain any heading row.

To upload a new list of volumes click the 'Upload CSV' button at the top right
of the table.

{% hint style='warning' %}
Uploading a CSV file will overwrite the current list of volumes for the
collection.
{% endhint %}
