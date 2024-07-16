# ⬆️ Upload Service

<p align="center">
  <img src="https://i.ibb.co/pj4D8ZZ/microservice-template-nodejs-js-social-preview-2.png" alt="repo-banner" />
</p>

<p align="center">
  <a href="https://www.x.com/YourAKShaw"><img src="https://img.shields.io/badge/@YourAKShaw-000000?style=for-the-badge&logo=x&logoColor=white" /></a>
</p>

A simple ⬆️ upload service built using Node.js, Express.js, and JavaScript using my template [microservice-template-nodejs-js](https://github.com/YourAKShaw/microservice-template-nodejs-js).

## Usage && Notes

### Sample

- Contains [Sample](./src/sample/) module from [microservice-template-nodejs-js](https://github.com/YourAKShaw/microservice-template-nodejs-js).
- Since the [Sample](./src/sample/) module makes use of the MongoClient from [mongodb](https://www.mongodb.com/resources/languages/mongodb-with-nodejs), it requires the MONGODB_URI in the .env, otherwise the server won't start. One way to bypass this, in case you don't need to checkout the Sample module and use only the Upload module, is to commenting the following piece of code from [sample.model.js](./src/sample/sample.model.js).

  ```js
  const sampleCollection = await (async () => {
    const db = await getDb();
    return db.collection('samples');
  })(); // Immediately Invoked Function Expression (IIFE) for collection creation
  ```

### Upload

Two types of upload supported:

1. File Attachment
2. File URL

#### File Attachment

**POST** _/api/upload_

##### form-data

| Key              | Value        |
| ---------------- | ------------ |
| fieldName (File) | [attachment] |

#### File URL

**POST** _/api/upload_

##### raw

```json
{
  "fileUrl": "<fileUrl>"
}
```

## Get to know me 😉

⚪ Author: [Ayush Kumar Shaw](https://www.github.com/YourAKShaw)

⚪ Website: [yourakshaw.com](https://www.yourakshaw.com)

⚪ X: [@YourAKShaw](https://www.x.com/YourAKShaw)

## License

This template is [MIT licensed](./LICENSE).
