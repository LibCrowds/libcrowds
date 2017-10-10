export default {
  getApiCategories: {
    status: 200,
    data: [
      {
          "info": null,
          "description": "An empty category not linked to a microsite.",
          "short_name": "empty_category",
          "created": "2016-04-04T14:32:23.801901",
          "link": "<link rel='self' title='category' href='https://example.com/api/category/6'/>",
          "id": 6,
          "name": "Empty Category"
      },
      {
          "info": {
            "collection": "cards_drawer_one"
          },
          "description": "A category in collection one.",
          "short_name": "cards_drawer_one",
          "created": "2017-08-30T23:33:59.280703",
          "link": "<link rel='self' title='category' href='https://example.com/api/category/9'/>",
          "id": 9,
          "name": "Cards Drawer One"
      },
      {
          "info": {
            "collection": "playbills"
          },
          "description": "Volume one of the playbills.",
          "short_name": "playbills_volume_one",
          "created": "2017-08-31T01:01:32.805695",
          "link": "<link rel='self' title='category' href='https://example.com/api/category/12'/>",
          "id": 12,
          "name": "Playbills Volume One"
      },
      {
          "info": {
            "collection": "playbills_special"
          },
          "description": "Example of a similar category name",
          "short_name": "special_playbills",
          "created": "2017-08-31T01:01:32.805695",
          "link": "<link rel='self' title='category' href='https://example.com/api/category/13'/>",
          "id": 13,
          "name": "Special Playbills"
      }
    ]
  },

  getDeleteCategory: {
    status: 200,
    data: {
      "category": {
        "created": "2017-01-24T13:08:09.873071",
        "description": "new",
        "id": 9,
        "name": "new",
        "short_name": "new"
      },
      "form": {
        "csrf": "token",
      },
      "template": "admin/del_category.html",
      "title": "Delete Category"
    }
  }
}