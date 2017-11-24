## PYBOSSA Configuration

LibCrowds relies on a PYBOSSA backend with a settings file that contains the
following:

``` python
# To allow requests from the frontend (modify origins according to your environment)
CORS_RESOURCES = {
  r"/*": {
    "origins": [
      "http://127.0.0.1:8080"
    ],
    "allow_headers": [
      'Content-Type',
      'Authorization',
      'X-CSRFToken'
    ],
    "supports_credentials": True
  }
}

# Additional category fields
CATEGORY_INFO_PUBLIC_FIELDS = [
  'tagline',
  'forum',
  'presenter',
  'license',
  'published',
  'content',
  'terminology',
  'background'
]

# Additional user fields
USER_INFO_PUBLIC_FIELDS = [
  'announcements'
]

# Additional project fields
PROJECT_INFO_PUBLIC_FIELDS = [
  'tags'
]

# Avoid 404 errors when accessing URLs with or without a trailing slash
STRICT_SLASHES = False

# Specify an SPA frontend
SPA_SERVER_NAME = 'http://127.0.0.1:8080'

# Allow projects to be published with no traditional task presenter
DISABLE_TASK_PRESENTER = True
```

{% hint style='warning' %}
The settings shown here are all required for the application to run correctly.
{% endhint %}
