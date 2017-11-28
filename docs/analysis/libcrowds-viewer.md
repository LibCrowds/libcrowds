# LibCrowds Viewer Analysis

Webhooks for Z39.50 projects should be sent to:

``` http
POST /libcrowds/analysis/libcrowds-viewer
```

The annotations for all task runs are compared. Those with similar selection
rectangles are clustered and analysis_complete is set to True.

Example result info

{
  "annotations": [],
  "doi": "10.5281/zenodo.890858",
  "analysis_complete": true
}
