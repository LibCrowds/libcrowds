# Administration

The LibCrowds platform is administered via the following set of dashboards
that can be reached via the main navigation bar:

{% for article in summary.parts[0].articles %}
  {% for child in article.articles %}
    * [{{ child.title }}]({{ child.path }})
  {% endfor %}
{% endfor %}

- [Site Admin](admin/site/README.md)
- [Collection Admin](admin/collection/README.md)
- [Project Admin](admin/project/README.md)
